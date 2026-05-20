const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: "us-east-1" }); // Ajuste para a sua região do S3

async function readS3Json(req, res) {
  try {
    // const idEmpresa = req.body.idEmpresa;

    // Jeito correto de receber o dado no controller:
    const { nomeCaminho } = req.body;

    
    if (!nomeCaminho) {
      return res.status(400).json({ error: "O nome do arquivo (Key) não foi definido." });
    }

    const command = new GetObjectCommand({ 
      Bucket: "rbc-train-track-sys", 
      Key: nomeCaminho 
    });

    const response = await s3Client.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

    const bodyContents = await streamToString(response.Body);
    const jsonData = JSON.parse(bodyContents);
    
    return res.status(200).json(jsonData);

  } catch (err) { 
    console.error("Error reading file:", err);
    return res.status(500).json({ error: err.message }); 
  }
}

module.exports = {
  readS3Json
};
