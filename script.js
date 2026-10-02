document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const year = document.getElementById("year");
  const backTop = document.getElementById("backToTop");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  year.textContent = new Date().getFullYear();

  // Theme switching with localStorage
  const savedTheme = localStorage.getItem("gopika-theme");
  if (savedTheme === "dark") body.classList.add("dark");
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("gopika-theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeToggle.innerHTML = body.classList.contains("dark")
      ? '<i class="bi bi-sun"></i>'
      : '<i class="bi bi-moon-stars"></i>';
  }

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;

      projectItems.forEach(item => {
        const show = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("d-none", !show);
      });
    });
  });

  // Contact form validation
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      formStatus.textContent = "Please correct the highlighted fields.";
      formStatus.className = "mt-3 text-danger";
      return;
    }

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    // Fetch API demonstration. The endpoint is a demo service; replace it
    // with your backend/API when deploying a real contact form.
    try {
      formStatus.textContent = "Sending...";
      formStatus.className = "mt-3 text-primary";

      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Request failed");
      formStatus.textContent = "Message submitted successfully (demo).";
      formStatus.className = "mt-3 text-success";
      form.reset();
      form.classList.remove("was-validated");
    } catch (error) {
      // The portfolio still works if the demo API is unavailable.
      formStatus.textContent = "Form validated successfully. Connect a backend to send real messages.";
      formStatus.className = "mt-3 text-success";
    }
  });

  // Back-to-top button
  window.addEventListener("scroll", () => {
    backTop.style.display = window.scrollY > 500 ? "grid" : "none";
  });

  backTop.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

  // Active navigation highlighting
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        const current = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (current) current.classList.add("active");
      }
    });
  }, {rootMargin: "-35% 0px -55% 0px"});

  sections.forEach(section => observer.observe(section));
});


// Fetch API demonstration: retrieve public GitHub profile data.
const githubButton = document.getElementById("loadGithub");
const githubResult = document.getElementById("githubResult");
if (githubButton) {
  githubButton.addEventListener("click", async () => {
    githubButton.disabled = true;
    githubButton.textContent = "Loading...";
    githubResult.innerHTML = "";
    try {
      const response = await fetch("https://api.github.com/users/gangavathugopika");
      if (!response.ok) throw new Error("Profile not found");
      const profile = await response.json();
      githubResult.innerHTML = `
        <div class="github-profile">
          <img src="${profile.avatar_url}" alt="GitHub profile avatar">
          <div>
            <strong>${profile.name || profile.login}</strong>
            <div class="text-secondary">@${profile.login} • ${profile.public_repos} public repositories</div>
          </div>
        </div>`;
    } catch (error) {
      githubResult.textContent = "GitHub profile data could not be loaded. You can replace the username in script.js with Gopika's actual GitHub username.";
    } finally {
      githubButton.disabled = false;
      githubButton.textContent = "↓ Load GitHub Data";
    }
  });
}
