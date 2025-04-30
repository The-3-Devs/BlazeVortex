// This function splits a message into smaller chunks if it exceeds the specified maxLength.
// It ensures that the chunks do not exceed the maxLength and are split at line breaks.

//smh vscode wrote that comment? new feature ig

export default function splitMessage(text: string, maxLength = 2000) {
    if (text.length <= maxLength) return [text];
  
    const lines = text.split('\n');
    const messages = [];
    let current = '';
  
    for (const line of lines) {
      if ((current + line + '\n').length > maxLength) {
        messages.push(current.trim());
        current = '';
      }
      current += line + '\n';
    }
  
    if (current) messages.push(current.trim());
  
    return messages;
  }
  