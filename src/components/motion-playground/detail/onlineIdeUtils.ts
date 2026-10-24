/**
 * Utilities for launching experiments in online IDEs (StackBlitz and CodeSandbox)
 * using their official project creation APIs with zero backend requirements.
 */

export interface IdeProjectFile {
  name: string;
  code: string;
  language: string;
}

export interface IdeProjectConfig {
  title: string;
  description: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
  template?: 'create-react-app' | 'html5';
}

/**
 * Opens a project in StackBlitz using their official form POST endpoint (https://stackblitz.com/run).
 * This generates an instant, live, editable environment with dependencies installed.
 */
export function openInStackBlitz(config: IdeProjectConfig) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://stackblitz.com/run';
  form.target = '_blank';

  const addInput = (name: string, value: string) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  addInput('project[title]', config.title);
  addInput('project[description]', config.description);
  addInput('project[template]', 'create-react-app');

  // Add files
  Object.entries(config.files).forEach(([filename, content]) => {
    addInput(`project[files][${filename}]`, content);
  });

  // Add dependencies
  Object.entries(config.dependencies).forEach(([pkg, version]) => {
    addInput(`project[dependencies][${pkg}]`, version);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * Creates a standard HTML template for standalone vanilla/canvas examples.
 */
export function createStandaloneHtmlTemplate(
  title: string,
  jsCode: string,
  cssCode: string = ''
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Motion Lab</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0A0A0C;
      color: #F5F2EB;
      font-family: monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    ${cssCode}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
${jsCode}
  </script>
</body>
</html>`;
}
