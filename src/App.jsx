import { useState, useRef } from "react";
import { toPng } from "html-to-image";

function App() {
  const [photos, setPhotos] = useState([]);
  const [hTop, setHTop] = useState("ଏଠାରେ ଉପର ହେଡଲାଇନ୍ ଲେଖନ୍ତୁ");
  const [hBot, setHBot] = useState("ଏଠାରେ ତଳ ହେଡଲାଇନ୍ ଲେଖନ୍ତୁ");
  const [results, setResults] = useState([]);
  const previewRefs = useRef([]);

  const generate = () => {
    let thumbs = [];
    for (let i = 0; i < photos.length; i += 2) {
      if (photos[i] && photos[i + 1]) {
        thumbs.push({ top: photos[i], bottom: photos[i + 1] });
      }
    }
    setResults(thumbs);
  };

  const downloadImage = async (index) => {
    const node = previewRefs.current[index];
    if (!node) return;
    const dataUrl = await toPng(node, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `thumbnail-${index + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📸 Thumbnail Maker</h1>
      <input type="file" multiple onChange={(e) => setPhotos(Array.from(e.target.files).map(f => URL.createObjectURL(f)))} />
      <br/><br/>
      <input placeholder="Top Headline (Yellow)" value={hTop} onChange={(e) => setHTop(e.target.value)} style={{width:"300px", padding:"8px"}} />
      <br/>
      <input placeholder="Bottom Headline (White)" value={hBot} onChange={(e) => setHBot(e.target.value)} style={{width:"300px", padding:"8px", marginTop:"10px"}} />
      <br/><br/>
      <button onClick={generate}>🤖 Generate Thumbnails</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {results.map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div ref={(el) => (previewRefs.current[index] = el)} 
                 style={{ width: "270px", height: "480px", border: "2px solid #000", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              <img src={item.top} style={{ width: "100%", height: "40%", objectFit: "cover" }} />
              
              <div style={{ background: "#800000", height: "20%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                <b style={{ color: "#FFD700", fontSize: "18px", textAlign: "center" }}>{hTop}</b>
                <b style={{ color: "#FFFFFF", fontSize: "18px", marginTop: "5px", textAlign: "center" }}>{hBot}</b>
              </div>

              <img src={item.bottom} style={{ width: "100%", height: "40%", objectFit: "cover" }} />
            </div>
            <button onClick={() => downloadImage(index)} style={{ marginTop: "5px" }}>📥 Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;