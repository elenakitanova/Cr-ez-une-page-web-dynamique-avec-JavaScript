// Je récupère le login et le message d'erreur
const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
	event.preventDefault(); // Empêche le rechargement de la page

	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

    try {
		const response = await fetch("http://localhost:5678/api/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

        const data = await response.json();
        console.log(data);

		if (response.ok) {
			// Stockage du token dans le localStorage
			localStorage.setItem("token", data.token);
			// Redirection vers la page d’accueil
			window.location.href = "index.html";
		} else {
			// Affichage du message d’erreur
			errorMessage.textContent = "E-mail ou mot de passe incorrect.";
		}
	} catch (error) {
		console.error("Erreur lors de la connexion :", error);
		errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer.";
	}
});

