const bcrypt = require("bcrypt");

async function generarHash() {
  const password = "SterannCC900";

  const hash = await bcrypt.hash(password, 10);

  console.log(hash);
}

generarHash();