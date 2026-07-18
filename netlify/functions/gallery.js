exports.handler = async function (event) {
  const cloudName = 'lfiye6jw';
  const tag = 'emma-georges-wedding';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "CLOUDINARY_API_KEY ou CLOUDINARY_API_SECRET manquant dans les variables d'environnement Netlify." })
    };
  }

  const auth = Buffer.from(apiKey + ':' + apiSecret).toString('base64');

  try {
    const cloudinaryRes = await fetch(
      'https://api.cloudinary.com/v1_1/' + cloudName + '/resources/image/tags/' + tag + '?max_results=200&context=true',
      { headers: { Authorization: 'Basic ' + auth } }
    );
    const data = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      return {
        statusCode: cloudinaryRes.status,
        body: JSON.stringify({ error: (data && data.error && data.error.message) || 'Erreur Cloudinary' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erreur inconnue' })
    };
  }
};
