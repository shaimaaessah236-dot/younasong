import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { getRandomQuizRound } from '../lib/quizData.js';
import { QuizQuestion } from '../types.js';

export interface DuelPlayer {
  id: string;
  name: string;
  ws: WebSocket;
  score: number;
  correctCount: number;
  currentQuestionIdx: number;
  answeredCurrent: boolean;
  selectedOption: number | null;
  isReady: boolean;
}

export interface DuelRoom {
  id: string;
  code: string;
  players: DuelPlayer[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  status: 'waiting' | 'in_progress' | 'round_result' | 'finished';
  createdAt: number;
}

export class QuizDuelManager {
  private rooms = new Map<string, DuelRoom>();
  private waitingPlayer: { id: string; name: string; ws: WebSocket } | null = null;

  public setup(server: HttpServer) {
    const wss = new WebSocketServer({ server, path: '/ws/quiz-duel' });

    wss.on('connection', (ws: WebSocket) => {
      let registeredPlayerId: string | null = null;
      let registeredRoomId: string | null = null;

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          const { type } = data;

          if (type === 'quick_match') {
            // Match with an existing waiting player or wait
            const playerName = data.playerName?.trim() || 'لاعب سبيستون';
            const playerId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            registeredPlayerId = playerId;

            if (this.waitingPlayer && this.waitingPlayer.ws.readyState === WebSocket.OPEN) {
              // Pair them up!
              const opponent = this.waitingPlayer;
              this.waitingPlayer = null;

              const roomId = `room-${Date.now()}`;
              registeredRoomId = roomId;
              const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

              const questions = getRandomQuizRound(5);
              const room: DuelRoom = {
                id: roomId,
                code: roomCode,
                players: [
                  {
                    id: opponent.id,
                    name: opponent.name,
                    ws: opponent.ws,
                    score: 0,
                    correctCount: 0,
                    currentQuestionIdx: 0,
                    answeredCurrent: false,
                    selectedOption: null,
                    isReady: true,
                  },
                  {
                    id: playerId,
                    name: playerName,
                    ws: ws,
                    score: 0,
                    correctCount: 0,
                    currentQuestionIdx: 0,
                    answeredCurrent: false,
                    selectedOption: null,
                    isReady: true,
                  },
                ],
                questions,
                currentQuestionIndex: 0,
                status: 'in_progress',
                createdAt: Date.now(),
              };

              this.rooms.set(roomId, room);

              // Notify both players that the battle has started!
              this.broadcastRoom(room, {
                type: 'duel_start',
                roomId,
                roomCode,
                questions,
                currentQuestionIndex: 0,
                players: room.players.map((p) => ({
                  id: p.id,
                  name: p.name,
                  score: p.score,
                  correctCount: p.correctCount,
                })),
              });
            } else {
              // Set as waiting player
              this.waitingPlayer = { id: playerId, name: playerName, ws };
              ws.send(
                JSON.stringify({
                  type: 'waiting_for_opponent',
                  message: 'جاري البحث عن متسابق آخر للمبارزة الحية...',
                })
              );
            }
          } else if (type === 'create_private_room') {
            // Create a custom private room with a code
            const playerName = data.playerName?.trim() || 'المتحدي الأول';
            const playerId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            registeredPlayerId = playerId;

            const roomId = `room-${Date.now()}`;
            registeredRoomId = roomId;
            const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

            const questions = getRandomQuizRound(5);
            const room: DuelRoom = {
              id: roomId,
              code: roomCode,
              players: [
                {
                  id: playerId,
                  name: playerName,
                  ws: ws,
                  score: 0,
                  correctCount: 0,
                  currentQuestionIdx: 0,
                  answeredCurrent: false,
                  selectedOption: null,
                  isReady: true,
                },
              ],
              questions,
              currentQuestionIndex: 0,
              status: 'waiting',
              createdAt: Date.now(),
            };

            this.rooms.set(roomId, room);
            ws.send(
              JSON.stringify({
                type: 'room_created',
                roomId,
                roomCode,
                message: `تم إنشاء الغرفة! شارك الرمز ${roomCode} مع صديقك للدخول.`,
              })
            );
          } else if (type === 'join_private_room') {
            // Join with roomCode
            const { roomCode, playerName } = data;
            const cleanCode = (roomCode || '').trim().toUpperCase();
            const playerJoinName = playerName?.trim() || 'المتحدي الثاني';
            const playerId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            registeredPlayerId = playerId;

            let targetRoom: DuelRoom | null = null;
            for (const room of this.rooms.values()) {
              if (room.code === cleanCode && room.status === 'waiting') {
                targetRoom = room;
                break;
              }
            }

            if (targetRoom && targetRoom.players.length === 1) {
              registeredRoomId = targetRoom.id;
              targetRoom.players.push({
                id: playerId,
                name: playerJoinName,
                ws,
                score: 0,
                correctCount: 0,
                currentQuestionIdx: 0,
                answeredCurrent: false,
                selectedOption: null,
                isReady: true,
              });
              targetRoom.status = 'in_progress';

              this.broadcastRoom(targetRoom, {
                type: 'duel_start',
                roomId: targetRoom.id,
                roomCode: targetRoom.code,
                questions: targetRoom.questions,
                currentQuestionIndex: 0,
                players: targetRoom.players.map((p) => ({
                  id: p.id,
                  name: p.name,
                  score: p.score,
                  correctCount: p.correctCount,
                })),
              });
            } else {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  message: 'رمز الغرفة غير صحيح أو أن الغرفة ممتلئة بالفعل.',
                })
              );
            }
          } else if (type === 'submit_answer') {
            const { roomId, playerId, questionIndex, optionIndex, timeLeft = 0 } = data;
            const room = this.rooms.get(roomId);
            if (!room || room.status !== 'in_progress') return;

            const currentQ = room.questions[room.currentQuestionIndex];
            if (!currentQ || room.currentQuestionIndex !== questionIndex) return;

            const player = room.players.find((p) => p.id === playerId);
            if (!player || player.answeredCurrent) return;

            player.answeredCurrent = true;
            player.selectedOption = optionIndex;

            const isCorrect = optionIndex === currentQ.correctIndex;
            if (isCorrect) {
              const speedBonus = Math.max(0, Math.floor(timeLeft / 2));
              player.score += 10 + speedBonus;
              player.correctCount += 1;
            }

            // Broadcast real-time score update
            this.broadcastRoom(room, {
              type: 'score_update',
              players: room.players.map((p) => ({
                id: p.id,
                name: p.name,
                score: p.score,
                correctCount: p.correctCount,
                answeredCurrent: p.answeredCurrent,
                selectedOption: p.selectedOption,
                isCorrect: p.selectedOption === currentQ.correctIndex,
              })),
              allAnswered: room.players.every((p) => p.answeredCurrent),
            });
          } else if (type === 'advance_question') {
            const { roomId } = data;
            const room = this.rooms.get(roomId);
            if (!room) return;

            // Reset current answered status
            room.players.forEach((p) => {
              p.answeredCurrent = false;
              p.selectedOption = null;
            });

            if (room.currentQuestionIndex + 1 < room.questions.length) {
              room.currentQuestionIndex += 1;
              this.broadcastRoom(room, {
                type: 'next_question',
                currentQuestionIndex: room.currentQuestionIndex,
              });
            } else {
              room.status = 'finished';
              // Determine winner
              let winnerId: string | 'draw' = 'draw';
              if (room.players.length === 2) {
                if (room.players[0].score > room.players[1].score) {
                  winnerId = room.players[0].id;
                } else if (room.players[1].score > room.players[0].score) {
                  winnerId = room.players[1].id;
                }
              }

              this.broadcastRoom(room, {
                type: 'duel_finished',
                players: room.players.map((p) => ({
                  id: p.id,
                  name: p.name,
                  score: p.score,
                  correctCount: p.correctCount,
                })),
                winnerId,
              });
            }
          } else if (type === 'rematch') {
            const { roomId } = data;
            const room = this.rooms.get(roomId);
            if (!room) return;

            // Start a new duel with fresh questions!
            room.questions = getRandomQuizRound(5);
            room.currentQuestionIndex = 0;
            room.status = 'in_progress';
            room.players.forEach((p) => {
              p.score = 0;
              p.correctCount = 0;
              p.answeredCurrent = false;
              p.selectedOption = null;
            });

            this.broadcastRoom(room, {
              type: 'duel_start',
              roomId: room.id,
              roomCode: room.code,
              questions: room.questions,
              currentQuestionIndex: 0,
              players: room.players.map((p) => ({
                id: p.id,
                name: p.name,
                score: 0,
                correctCount: 0,
              })),
            });
          }
        } catch (_err) {
          // Ignore malformed messages
        }
      });

      ws.on('close', () => {
        if (this.waitingPlayer && this.waitingPlayer.ws === ws) {
          this.waitingPlayer = null;
        }

        if (registeredRoomId) {
          const room = this.rooms.get(registeredRoomId);
          if (room) {
            this.broadcastRoom(
              room,
              {
                type: 'opponent_left',
                message: 'لقد غادر المنافس المبارزة.',
              },
              ws
            );
            this.rooms.delete(registeredRoomId);
          }
        }
      });
    });
  }

  private broadcastRoom(room: DuelRoom, messageObj: any, exceptWs?: WebSocket) {
    const msg = JSON.stringify(messageObj);
    room.players.forEach((p) => {
      if (p.ws && p.ws.readyState === WebSocket.OPEN && p.ws !== exceptWs) {
        try {
          p.ws.send(msg);
        } catch {
          // Handled
        }
      }
    });
  }
}

export const quizDuelManager = new QuizDuelManager();
