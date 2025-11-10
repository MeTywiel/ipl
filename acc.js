

async function hash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const passwords = {
  farm: "8bef9b94af8afcc7a8d9b53e5741488c0091866dfd5e66c8f7764d206648de5d",
  com:  "4c838c2788ef5fc6efd33d6c29a7cdfc2983303ff252dbb726bec20c482eeecf",
  quetes: "61032bbe9ba1e16fad843db50c9079af69029062135311101769181fa1863fef"
};

function authKey(zone) {
  return "auth_" + zone;
}

async function accessZone(event, zone) {
  if (event && event.preventDefault) event.preventDefault();

  if (localStorage.getItem(authKey(zone)) === "1") {
    window.location.href = zone + ".html";
    return;
  }

  const pass = prompt("Entrez le mot de passe pour la zone " + zone.toUpperCase() + " :");
  if (!pass || pass.trim() === "") {
    alert("❌ Mot de passe vide interdit !");
    return;
  }

  const enteredHash = await hash(pass);
  if (enteredHash === passwords[zone]) {
    if (confirm("Souhaitez-vous que ce navigateur se souvienne de cet accès ?")) {
      localStorage.setItem(authKey(zone), "1");
    }
    window.location.href = zone + ".html";
  } else {
    alert("❌ Mauvais mot de passe !");
  }
}
