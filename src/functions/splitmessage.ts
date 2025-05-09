// This function splits a message into smaller chunks if it exceeds the specified maxLength.
// It ensures that the chunks do not exceed the maxLength and are split at line breaks.

//smh vscode wrote that comment? new feature ig

export default function splitMessage(text: string, maxLength = 2000): string[] {
    if (text.length <= maxLength) return [text];
  
    const messages: string[] = [];
    let current = '';
  
    const tokens = text.match(/(\s+|\S+)/g) || [];
  
    for (const token of tokens) {
      if (token.length > maxLength) {
        if (current) {
          messages.push(current);
          current = '';
        }
        for (let i = 0; i < token.length; i += maxLength) {
          messages.push(token.slice(i, i + maxLength));
        }
        continue;
      }
  
      if ((current + token).length > maxLength) {
        messages.push(current);
        current = '';
      }
  
      current += token;
    }
  
    if (current) {
      messages.push(current);
    }
  
    return messages;
  }
  