const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const roles = {
  USER: "strawhats-user",
  ADMIN: "strawhats-admin",
};

// From https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_fNgI7HwbT/.well-known/jwks.json
const jsonWebKeys = [
  {
    alg: "RS256",
    e: "AQAB",
    kid: "WcX/LDgDYJve8nheTTYxYmGegRS+2MNqSyb5f0UEgcQ=",
    kty: "RSA",
    n: "y0scWhQ1vInKmrX7C86nXOU5qla3NxTAe0EgGeFsegQ-WPNEMK7yLiWmwO9gCahcv6VqUBPEWSTEKQeSxOi2vFEM6zO8caf_JZFUAWE--v8p65LfrJ7VTMtJ5vyBFfIl38o_EMagLSl_7ND4fRCVcfV4R7wwvSiMNpqZ1aqkhjmFudV4dau4huVZcjNaTCgM1AvfiwLPlqi0NrcfjAdEvlvBIuPHw7ao6FFFbTXwhqXM5v9MwLX54ONLpGeY2oJxP-NYgUJptsppEvbzkIHCSfWZJJ_4wKNQlaw2Dy89gCH13HNlvXUCNO_qKmcy5JBd9vh9v8cJ77ThU--vJd9hZQ",
    use: "sig",
  },
  {
    alg: "RS256",
    e: "AQAB",
    kid: "xh46R61ax3YgWXhzfgwjPZd8PXW20I6kYaF/RlmhRSk=",
    kty: "RSA",
    n: "wYeekWGUwFHGjh7CucjXLlbJwDkp6GF8jfCG6C1wYL_K4C7uiS67yN2FePfp4nJgPx1I-GSyvK8Chc7KBvQqnL-i3snn4XguL5rjLy26_hMBPzSuZ8Pgsc_jGMUqF3EjwWacmTVXY5OMnCyw8Al2DAAqXXFaluT3s8mPrxtXcouQSufr6cf9j91F53t5OzwaRsPI5k5E2Jk0LdgIfRWb9NkD6HUFZkDsQ_oOUvFiLn9HFx3W6YaoQgSBfsAJJjSzZXS71EGlGrBtE9FNxxKG5ZhMEl07QY7bXPKe4KUUHmC2CHaVx2ISJlgm5sQ4Tw2qyr3CkVLQX_3WBwqdk42ZqQ",
    use: "sig",
  },
];

// From https://stackoverflow.com/a/55506280
function decodeTokenHeader(token) {
  const [headerEncoded] = token.split(".");
  const buff = Buffer.from(headerEncoded, "base64");
  const text = buff.toString("ascii");
  return JSON.parse(text);
}

function validateToken(token) {
  const header = decodeTokenHeader(token);
  const jsonWebKey = getJsonWebKeyWithKID(header.kid);
  return verifyJsonWebTokenSignature(token, jsonWebKey);
}

function getJsonWebKeyWithKID(kid) {
  for (let jwk of jsonWebKeys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
}

function verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
  const pem = jwkToPem(jsonWebKey);
  return jwt.verify(token, pem, { algorithms: ["RS256"] });
}

const auth = (role) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = validateToken(token);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  if (!req.user) {
    return res.status(401).send("Invalid Token");
  }

  if (!req.user["cognito:groups"].includes(role)) {
    return res.status(403).send("Unauthorised");
  }

  return next();
};

module.exports = { roles, auth };
