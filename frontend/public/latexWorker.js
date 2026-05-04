// public/latexWorker.js

self.onmessage = async (event) => {
  const { code } = event.data;
  
  if (!code) return;

  try {
    console.log("Worker: Starting compilation...");
  
    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        compiler: "pdflatex",
        resources: [
          {
            main: true,
            content: code
          }
        ]
      })
    });

    // 2. Handle errors
    if (!response.ok) {
      const errorLog = await response.text();
      console.error("--- RAW LATEX ERROR LOG ---", errorLog);
      
      // Try to extract a clean message
      let msg = `Compilation failed (Status ${response.status})`;
      if (errorLog.includes('!')) {
        const match = errorLog.match(/!(.*)/);
        if (match) msg = match[1].trim();
      }
      
      throw new Error(msg);
    }

    // 3. Success! Return the PDF to React
    const pdfBlob = await response.blob();
    console.log("Worker: Compilation success, blob received", pdfBlob.size, "bytes");
    
    self.postMessage({ 
      type: 'SUCCESS', 
      pdfBlob: pdfBlob 
    });

  } catch (error) {
    console.error("Worker Error:", error.message);
    self.postMessage({ 
      type: 'ERROR', 
      message: error.message 
    });
  }
};
