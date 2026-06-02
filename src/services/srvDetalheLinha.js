const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require("csv-parser");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function lerCsv(key) {

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    });

    const response = await s3.send(command);

    return new Promise((resolve, reject) => {

        const resultados = [];

        response.Body
            .pipe(csv())
            .on("data", (linha) => resultados.push(linha))
            .on("end", () => resolve(resultados))
            .on("error", reject);

    });

}

module.exports = {
    lerCsv
};