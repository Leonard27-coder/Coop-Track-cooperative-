"use strict";

// CoopTrack frontend.
// All records are loaded from and saved to the Java API and SQLite database.

const members = [];
const tasks = [];
const contributions = [];
const supportRecords = [];
const invitations = [];

let nextId = 1;

// -------------------- GENERAL HELPERS --------------------

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function showMessage(message) {
  alert(message);
}

function getElement(id) {
  return document.getElementById(id);
}

async function readApiResponse(response) {
  const text = await response.text();
  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = { error: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      result.error || result.message || `Server returned ${response.status}`,
    );
  }

  return result;
}

// -------------------- MEMBERS --------------------

function renderMembers() {
  const list = getElement("member-list");

  if (list) {
    list.innerHTML = members.length
      ? members
          .map(
            (member) => `
              <tr>
                <td>${escapeHtml(member.id)}</td>
                <td>${escapeHtml(member.name)}</td>
                <td>${escapeHtml(member.email)}</td>
                <td>${escapeHtml(member.phone)}</td>
                <td>${escapeHtml(member.status)}</td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="5" class="empty">No members registered yet.</td></tr>';
  }

  // Update member dropdowns if they exist.
  document.querySelectorAll(".member-select").forEach((select) => {
    const selectedValue = select.value;

    select.innerHTML =
      '<option value="">Select a member</option>' +
      members
        .map(
          (member) => `
            <option value="${escapeHtml(member.id)}">
              ${escapeHtml(member.name)}
            </option>
          `,
        )
        .join("");

    if (members.some((member) => String(member.id) === selectedValue)) {
      select.value = selectedValue;
    }
  });
}

async function loadMembers() {
  try {
    const response = await fetch("/api/members");
    const data = await readApiResponse(response);

    if (!Array.isArray(data)) {
      throw new Error("The members API did not return a list.");
    }

    members.splice(0, members.length, ...data);
    renderMembers();
  } catch (error) {
    console.error("Could not load members:", error);
    showMessage(`Could not load members: ${error.message}`);
  }
}

const memberForm = getElement("member-form");

if (memberForm) {
  memberForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = memberForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const formData = new FormData(memberForm);

      const member = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
      };

      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });

      const result = await readApiResponse(response);

      await loadMembers();
      memberForm.reset();

      showMessage(result.message || "Member saved successfully.");
    } catch (error) {
      console.error("Could not save member:", error);
      showMessage(`Could not save member: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// -------------------- TASKS --------------------

function renderTasks() {
  const list = getElement("task-list");

  if (list) {
    list.innerHTML = tasks.length
      ? tasks
          .map(
            (task) => `
              <tr>
                <td>${escapeHtml(task.id)}</td>
                <td>${escapeHtml(task.title)}</td>
                <td>${escapeHtml(task.description)}</td>
                <td>${escapeHtml(task.status)}</td>
                <td>
                  <button
                    type="button"
                    class="task-status-button"
                    data-task-id="${escapeHtml(task.id)}"
                  >
                    Update status
                  </button>
                </td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="5" class="empty">No tasks recorded yet.</td></tr>';
  }
}

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    const data = await readApiResponse(response);

    if (!Array.isArray(data)) {
      throw new Error("The tasks API did not return a list.");
    }

    tasks.splice(0, tasks.length, ...data);
    renderTasks();
  } catch (error) {
    console.error("Could not load tasks:", error);
    showMessage(`Could not load tasks: ${error.message}`);
  }
}

const taskForm = getElement("task-form");

if (taskForm) {
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = taskForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const formData = new FormData(taskForm);

      const task = {
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim(),
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const result = await readApiResponse(response);

      await loadTasks();
      taskForm.reset();

      showMessage(result.message || "Task saved successfully.");
    } catch (error) {
      console.error("Could not save task:", error);
      showMessage(`Could not save task: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".task-status-button");

  if (!button) return;

  const taskId = button.dataset.taskId;
  const task = tasks.find((item) => String(item.id) === String(taskId));

  if (!task) return;

  const statuses = ["Pending", "In Progress", "Completed"];
  const currentIndex = statuses.indexOf(task.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];

  button.disabled = true;

  try {
    const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    await readApiResponse(response);
    await loadTasks();
  } catch (error) {
    console.error("Could not update task:", error);
    showMessage(`Could not update task: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

// -------------------- CONTRIBUTIONS --------------------

function renderContributions() {
  const list = getElement("contribution-list");

  if (list) {
    list.innerHTML = contributions.length
      ? contributions
          .map(
            (contribution) => `
              <tr>
                <td>${escapeHtml(contribution.id)}</td>
                <td>${escapeHtml(contribution.memberName || contribution.memberId)}</td>
                <td>${escapeHtml(contribution.amount)}</td>
                <td>${escapeHtml(contribution.date || contribution.createdAt || "")}</td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="4" class="empty">No contributions recorded yet.</td></tr>';
  }
}

async function loadContributions() {
  try {
    const response = await fetch("/api/contributions");
    const data = await readApiResponse(response);

    if (!Array.isArray(data)) {
      throw new Error("The contributions API did not return a list.");
    }

    contributions.splice(0, contributions.length, ...data);
    renderContributions();
  } catch (error) {
    console.error("Could not load contributions:", error);
    showMessage(`Could not load contributions: ${error.message}`);
  }
}

const contributionForm = getElement("contribution-form");

if (contributionForm) {
  contributionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contributionForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const formData = new FormData(contributionForm);

      const contribution = {
        memberId: formData.get("memberId"),
        amount: Number(formData.get("amount")),
      };

      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contribution),
      });

      const result = await readApiResponse(response);

      await loadContributions();
      contributionForm.reset();

      showMessage(result.message || "Contribution saved successfully.");
    } catch (error) {
      console.error("Could not save contribution:", error);
      showMessage(`Could not save contribution: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// -------------------- SUPPORT RECORDS --------------------

function renderSupportRecords() {
  const list = getElement("support-list");

  if (list) {
    list.innerHTML = supportRecords.length
      ? supportRecords
          .map(
            (record) => `
              <tr>
                <td>${escapeHtml(record.id)}</td>
                <td>${escapeHtml(record.memberName || record.memberId || "")}</td>
                <td>${escapeHtml(record.type || record.category || "")}</td>
                <td>${escapeHtml(record.description || record.note || "")}</td>
                <td>${escapeHtml(record.status || "")}</td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="5" class="empty">No support records yet.</td></tr>';
  }
}

async function loadSupportRecords() {
  try {
    const response = await fetch("/api/support");
    const data = await readApiResponse(response);

    if (!Array.isArray(data)) {
      throw new Error("The support API did not return a list.");
    }

    supportRecords.splice(0, supportRecords.length, ...data);
    renderSupportRecords();
  } catch (error) {
    console.error("Could not load support records:", error);
    showMessage(`Could not load support records: ${error.message}`);
  }
}

const supportForm = getElement("support-form");

if (supportForm) {
  supportForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = supportForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const formData = new FormData(supportForm);

      const support = {
        memberId: formData.get("memberId"),
        type: String(formData.get("type") || "").trim(),
        description: String(formData.get("description") || "").trim(),
      };

      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(support),
      });

      const result = await readApiResponse(response);

      await loadSupportRecords();
      supportForm.reset();

      showMessage(result.message || "Support record saved successfully.");
    } catch (error) {
      console.error("Could not save support record:", error);
      showMessage(`Could not save support record: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// -------------------- INVITATION KEYS --------------------

function renderInvitations() {
  const list = getElement("invitation-list");

  if (!list) return;

  list.innerHTML = invitations.length
    ? invitations
        .map(
          (invitation) => `
            <tr>
              <td>${escapeHtml(invitation.key)}</td>
              <td>${escapeHtml(invitation.note || invitation.purpose || "")}</td>
              <td>${escapeHtml(invitation.status)}</td>
            </tr>
          `,
        )
        .join("")
    : '<tr><td colspan="3" class="empty">No invitation keys created yet.</td></tr>';
}

async function loadInvitations() {
  try {
    const response = await fetch("/api/invitations");
    const data = await readApiResponse(response);

    if (!Array.isArray(data)) {
      throw new Error("The invitations API did not return a list.");
    }

    invitations.splice(0, invitations.length, ...data);
    renderInvitations();
  } catch (error) {
    console.error("Could not load invitation keys:", error);
    showMessage(`Could not load invitation keys: ${error.message}`);
  }
}

const invitationForm = getElement("invitation-form");

if (invitationForm) {
  invitationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = invitationForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const note =
        getElement("invitation-note")?.value.trim() || "Cooperative membership";

      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      const result = await readApiResponse(response);

      await loadInvitations();
      invitationForm.reset();

      showMessage(
        `Invitation key created successfully!\n\nKey: ${result.key}\nStatus: ${result.status}`,
      );
    } catch (error) {
      console.error("Could not create invitation key:", error);
      showMessage(`Could not create invitation key: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// -------------------- INVITATION KEY VALIDATION --------------------

const validateInvitationForm = getElement("validate-invitation-form");

if (validateInvitationForm) {
  validateInvitationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const keyInput =
      getElement("validation-key") ||
      getElement("invitation-key") ||
      getElement("invite-key");

    const key = keyInput?.value.trim();

    if (!key) {
      showMessage("Please enter an invitation key.");
      return;
    }

    const submitButton = validateInvitationForm.querySelector(
      'button[type="submit"], input[type="submit"]',
    );

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch("/api/invitations/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const result = await readApiResponse(response);

      showMessage(
        result.message ||
          (result.valid
            ? "Invitation key is valid."
            : "Invitation key is invalid."),
      );

      await loadInvitations();
    } catch (error) {
      console.error("Could not validate invitation key:", error);
      showMessage(`Could not validate invitation key: ${error.message}`);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// -------------------- INITIAL SETUP --------------------

renderMembers();
renderTasks();
renderContributions();
renderSupportRecords();
renderInvitations();

if (typeof showSection === "function") {
  showSection(window.location.hash.slice(1) || "dashboard");
}

async function initialiseApp() {
  await loadMembers();

  await Promise.all([
    loadTasks(),
    loadContributions(),
    loadSupportRecords(),
    loadInvitations(),
  ]);
}

initialiseApp();
