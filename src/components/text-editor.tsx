import './text-editor.css';
import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  const initMarkdown = 
    "## CheatBook\n" +
    "This is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown.\n" + 
    "- Click any text cell (including this one) to edit it\n" + 
    "- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell!\n" +
    "- You can show any React component, string, number, or anything else by calling the `show` function. This is a function built into this environment. Call show multiple times to show multiple values\n" +
    "- Re-order or delete cells using the buttons on the top right\n" +
    "- Add new cells by hovering on the divider between each cell\n" +
    "If your using the CLI version of this application, all of your changes get saved to the file you opened CheatBook with. So if you ran `npx cheatbook serve test.js`, all of the text and code you write will be saved to the `test.js` file.";

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content || initMarkdown}
          onChange={(v) => updateCell(cell.id, v || '')}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || initMarkdown} />
      </div>
    </div>
  );
};

export default TextEditor;
