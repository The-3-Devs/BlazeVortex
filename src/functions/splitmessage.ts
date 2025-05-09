// This function splits a message into smaller chunks if it exceeds the specified maxLength.
// It ensures that the chunks do not exceed the maxLength and are split at line breaks.

//smh vscode wrote that comment? new feature ig

export default function splitMessage(text: string, maxLength = 2000): string[] {
    if (text.length <= maxLength) return [text];
  
    const words = text.split(/\s+/);
    const messages: string[] = [];
    let current = '';
  
    for (const word of words) {
      if (word.length > maxLength) {
        if (current) {
          messages.push(current.trim());
          current = '';
        }
        for (let i = 0; i < word.length; i += maxLength) {
          messages.push(word.slice(i, i + maxLength));
        }
        continue;
      }
  
      if ((current + word + ' ').length > maxLength) {
        messages.push(current.trim());
        current = '';
      }
  
      current += word + ' ';
    }
  
    if (current.trim()) {
      messages.push(current.trim());
    }
  
    return messages;
  }
  