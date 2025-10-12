if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

const campaignForm = document.getElementById("campaignForm");
const campaignList = document.getElementById("campaignList");
const search = document.getElementById("search");

async function loadCampaigns() {
    const res = await fetch("http://localhost:5000/campaigns");
    const data = await res.json();
    displayCampaigns(data);
}

function displayCampaigns(campaigns) {
    const filter = search.value.toLowerCase();
    const filtered = campaigns.filter(c => c.campaignName.toLowerCase().includes(filter));

    // Dashboard counts
    const total = filtered.length;
    const active = filtered.filter(c => c.status === "Active").length;
    const paused = filtered.filter(c => c.status === "Paused").length;
    const completed = filtered.filter(c => c.status === "Completed").length;

    document.getElementById("totalCount").innerText = `Total: ${total}`;
    document.getElementById("activeCount").innerText = `Active: ${active}`;
    document.getElementById("pausedCount").innerText = `Paused: ${paused}`;
    document.getElementById("completedCount").innerText = `Completed: ${completed}`;

    campaignList.innerHTML = "";
    filtered.forEach(c => {
        campaignList.innerHTML += `
      <tr>
        <td>${c.campaignName}</td>
        <td>${c.clientName}</td>
        <td>${c.startDate}</td>
        <td>${c.status}</td>
        <td>
          <button onclick="updateStatus('${c.id}','Active')">Active</button>
          <button onclick="updateStatus('${c.id}','Paused')">Pause</button>
          <button onclick="updateStatus('${c.id}','Completed')">Done</button>
          <button onclick="deleteCampaign('${c.id}')">Delete</button>
        </td>
      </tr>`;
    });
}


campaignForm.addEventListener("submit", async e => {
    e.preventDefault();
    const newCampaign = {
        campaignName: document.getElementById("campaignName").value,
        clientName: document.getElementById("clientName").value,
        startDate: document.getElementById("startDate").value,
        status: document.getElementById("status").value
    };

    await fetch("http://localhost:5000/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign)
    });
    campaignForm.reset();
    loadCampaigns();
});

async function updateStatus(id, status) {
    await fetch(`http://localhost:5000/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    loadCampaigns();
}

async function deleteCampaign(id) {
    await fetch(`http://localhost:5000/campaigns/${id}`, { method: "DELETE" });
    loadCampaigns();
}

search.addEventListener("input", loadCampaigns);
loadCampaigns();