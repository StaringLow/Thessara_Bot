function showSection(name, el) {
  document.querySelectorAll('.config-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const section = document.getElementById(`section-${name}`);
  if (section) section.classList.add('active');
  if (el) el.classList.add('active');
  return false;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

async function saveConfig(guildId, endpoint, data, statusId) {
  const statusEl = document.getElementById(statusId);
  try {
    const res = await fetch(`/api/${guildId}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      showToast(`✅ ${json.message}`);
      if (statusEl) { statusEl.textContent = '✅ Sauvegardé'; setTimeout(() => statusEl.textContent = '', 3000); }
    } else {
      showToast('❌ Erreur lors de la sauvegarde', 'error');
    }
  } catch (err) {
    showToast('❌ Erreur de connexion', 'error');
  }
}

function saveWelcome(guildId) {
  saveConfig(guildId, 'welcome', {
    channelId: document.getElementById('welcome-channel').value,
    roleId: document.getElementById('welcome-role').value,
  }, 'welcome-status');
}

function saveTickets(guildId) {
  saveConfig(guildId, 'tickets', {
    channelId: document.getElementById('ticket-channel').value,
    staffRoleId: document.getElementById('ticket-staff-role').value,
  }, 'tickets-status');
}

function saveLogs(guildId) {
  saveConfig(guildId, 'logs', {
    channelId: document.getElementById('logs-channel').value,
  }, 'logs-status');
}

function saveModeration(guildId) {
  saveConfig(guildId, 'moderation', {
    staffRoleId: document.getElementById('mod-staff-role').value,
  }, 'moderation-status');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => e.preventDefault());
});
