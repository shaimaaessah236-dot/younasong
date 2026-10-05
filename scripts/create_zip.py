import os
import zipfile

def create_project_zip():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_zip_path = os.path.join(base_dir, "public", "yona-songs-project.zip")
    
    # Excluded directories
    exclude_dirs = {
        'node_modules',
        'dist',
        '.git',
        '.next',
        '.cache',
        'tmp',
        '.vscode',
        '.idea'
    }
    
    # Only project directories and files in workspace root
    allowed_dirs = {'src', 'public', 'assets', 'app', 'supabase', 'scripts'}
    allowed_root_files = {
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'index.html',
        'README.md',
        '.gitignore',
        '.env.example',
        'server.ts',
        'metadata.json',
        'vercel.json',
        'firebase-blueprint.json',
        'firebase-applet-config.json',
        'firestore.rules',
        'bun.lock'
    }

    print(f"Creating project ZIP at {output_zip_path} from {base_dir}...")
    
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add root files
        for filename in allowed_root_files:
            file_path = os.path.join(base_dir, filename)
            if os.path.isfile(file_path):
                arcname = os.path.join("yona-songs", filename)
                zipf.write(file_path, arcname=arcname)
                print(f"Added root file: {filename}")

        # Add allowed directories
        for directory in allowed_dirs:
            dir_path = os.path.join(base_dir, directory)
            if not os.path.isdir(dir_path):
                continue
                
            for root, dirs, files in os.walk(dir_path):
                # Filter out excluded subdirs
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                
                for file in files:
                    # Skip the zip itself and logs/env secrets
                    if file.endswith('.zip') or file.endswith('.log') or file == '.env':
                        continue
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, base_dir)
                    arcname = os.path.join("yona-songs", rel_path)
                    zipf.write(full_path, arcname=arcname)

    size_mb = os.path.getsize(output_zip_path) / (1024 * 1024)
    print(f"ZIP created successfully: {output_zip_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    create_project_zip()
