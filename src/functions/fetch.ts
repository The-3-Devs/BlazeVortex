 export default async function fetchURL(Url: string){
    const response = await fetch(Url)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const textResult = await response.text();
      console.log(textResult);
      return textResult;
     }
