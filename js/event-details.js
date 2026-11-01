/**
 * EE - VLSI DESIGN AND TECHNOLOGY
 * Dedicated Event Details Page Script (event-details.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Extract event id from URL query parameter or hash
  const urlParams = new URLSearchParams(window.location.search);
  let eventId = urlParams.get('id');
  if (!eventId && window.location.hash) {
    eventId = window.location.hash.replace('#', '').replace('event/', '');
  }

  // Fallback to first event if none specified
  if (!eventId && typeof EVENTS_DATA !== 'undefined' && EVENTS_DATA.length > 0) {
    eventId = EVENTS_DATA[0].id;
  }

  const event = getEventById(eventId);

  // Update Department info on page
  if (typeof DEPARTMENT_CONFIG !== 'undefined') {
    document.querySelectorAll('[data-dept-field]').forEach(el => {
      const field = el.getAttribute('data-dept-field');
      if (DEPARTMENT_CONFIG[field]) {
        el.textContent = DEPARTMENT_CONFIG[field];
      }
    });
  }

  const container = document.getElementById('eventDetailsContainer');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');

  if (!event) {
    if (container) {
      container.innerHTML = `
        <div class="events-empty-state" style="margin: 3rem 0;">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 class="empty-title">Event Not Found</h2>
          <p class="empty-desc">The requested department event could not be found. It may have been updated or moved.</p>
          <a href="index.html" class="btn-lg btn-primary" style="margin-top: 1rem;">Back to All Events</a>
        </div>
      `;
    }
    return;
  }

  // Set document title
  document.title = `${event.title} | EE - VLSI DESIGN AND TECHNOLOGY`;
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = event.title;
  }

  // Generate SVG banner pattern safely
  const theme = event.theme || {
    patternType: 'wafer-grid',
    primaryColor: '#1d4ed8',
    accentGradient: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'
  };
  let bgSvg = '';
  try {
    if (typeof EventIllustrations !== 'undefined' && EventIllustrations.getSvg) {
      bgSvg = EventIllustrations.getSvg(
        theme.patternType || 'wafer-grid',
        theme.primaryColor || '#1d4ed8',
        theme.accentGradient || 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'
      );
    }
  } catch(err) {}

  // Render Full Page View
  if (container) {
    const isCompleted = (event.status === 'Completed');
    const isOpen = !isCompleted && (event.regControl === 'open' || (event.status === 'Open' && !event.registrationClosed));
    const isOpensSoon = !isCompleted && !isOpen && (event.regControl === 'opens_soon' || event.status === 'Coming Soon' || event.status === 'Opens Soon');
    const isClosed = !isCompleted && !isOpen && !isOpensSoon;

    let statusBadgeHtml = '';
    if (isCompleted) {
      statusBadgeHtml = '<span class="card-status-badge status-completed">✅ Event Completed</span>';
    } else if (isOpen) {
      statusBadgeHtml = '<span class="card-status-badge" style="background:#ecfdf5; color:#047857;">🟢 Registration Open</span>';
    } else if (isOpensSoon) {
      statusBadgeHtml = '<span class="card-status-badge status-coming-soon">🔥 Opens Soon</span>';
    } else {
      statusBadgeHtml = '<span class="card-status-badge" style="background:#fee2e2; color:#b91c1c; border: 1px solid #fca5a5;">🔴 Registration Closed</span>';
    }

    let ctaTitle = 'Ready to participate?';
    let ctaSub = `Register before <strong>${event.registrationDeadline}</strong> to secure your seat.`;
    let ctaAction = `<button id="detailPageRegisterBtn" class="btn-lg btn-primary">Register for this Event</button>`;

    if (isCompleted) {
      ctaTitle = 'Event Successfully Concluded';
      ctaSub = 'Registrations are closed for this edition. Stay tuned for upcoming events!';
      ctaAction = '<span class="btn-status-completed" style="padding: 0.75rem 1.25rem; font-size: 0.95rem;">Event Concluded</span>';
    } else if (isOpensSoon) {
      ctaTitle = `${event.title} Registration Opens Soon!`;
      ctaSub = 'The registration form is currently locked by the department admin and will open when announced.';
      ctaAction = '<button id="detailPageRegisterBtn" class="btn-lg btn-secondary">🔥 Opens Soon (Registration Locked)</button>';
    } else if (isClosed) {
      ctaTitle = 'Registrations Closed';
      ctaSub = 'Registrations for this event have been closed by the department admin.';
      ctaAction = '<button class="btn-lg btn-secondary" disabled style="opacity: 0.75; cursor: not-allowed;">Registration Closed</button>';
    }

    container.innerHTML = `
      <div class="standalone-detail-card">
        <!-- Themed Header Banner -->
        <div class="detail-hero-banner">
          ${bgSvg}
          <div class="detail-banner-overlay">
            <div class="detail-badges-row">
              <span class="detail-category-pill">${event.categoryLabel || event.category}</span>
              ${statusBadgeHtml}
            </div>
            <h1 class="detail-hero-title">${event.title}</h1>
            <p class="detail-hero-summary">${event.shortSummary}</p>
          </div>
        </div>

        <div class="detail-body-content">
          ${event.posterImage ? `
            <div class="modal-poster-ratio-box" style="max-height: 400px; margin-bottom: 2rem;">
              <img src="${event.posterImage}" alt="${event.title} Poster" class="modal-poster-img" style="object-fit: ${event.posterFit || 'cover'};">
              <span class="modal-ratio-badge">16:9 Ratio</span>
            </div>
          ` : ''}

          <!-- Key Meta Bar -->
          <div class="detail-meta-box">
            <div class="meta-box-item">
              <span class="meta-box-label">📅 Event Date & Time</span>
              <span class="meta-box-value">${event.eventDate}</span>
              <span class="meta-box-sub">${event.eventTime}</span>
            </div>

            <div class="meta-box-item highlight-box">
              <span class="meta-box-label">⏳ Registration Deadline</span>
              <span class="meta-box-value deadline-accent">${event.registrationDeadline}</span>
              <span class="meta-box-sub">Seats: ${event.seatsAvailable || 'Limited'}</span>
            </div>

            <div class="meta-box-item">
              <span class="meta-box-label">📍 Venue & Mode</span>
              <span class="meta-box-value">${event.venue}</span>
              <span class="meta-box-sub">${event.venueType}</span>
            </div>
          </div>

          <!-- Description Section -->
          <section class="detail-section">
            <h2 class="detail-heading">About This Event</h2>
            <p class="detail-text">${event.description}</p>
          </section>

          <!-- Prerequisites & EDA Tools -->
          <div class="detail-two-col">
            <section class="detail-section">
              <h3 class="detail-subheading">Prerequisites & Eligibility</h3>
              <p class="detail-text">${event.prerequisites || 'Open to all students interested in semiconductor design.'}</p>
            </section>

            <section class="detail-section">
              <h3 class="detail-subheading">EDA Tools & Lab Hardware</h3>
              <div class="cad-tools-tags">
                ${(event.edaTools || []).map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
              </div>
            </section>
          </div>

          <!-- Detailed Schedule / Agenda -->
          <section class="detail-section">
            <h2 class="detail-heading">Session Schedule & Timeline</h2>
            <div class="schedule-timeline">
              ${(event.schedule || []).map(item => `
                <div class="timeline-row">
                  <span class="timeline-time">${item.time}</span>
                  <span class="timeline-topic">${item.topic}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Coordinators -->
          <section class="detail-section">
            <h2 class="detail-heading">Contact & Coordination</h2>
            <div class="coordinators-grid">
              ${event.coordinator ? `
                <div class="coordinator-card">
                  <div class="coord-role">Faculty Coordinator</div>
                  <div class="coord-name">${event.coordinator.name}</div>
                  <div class="coord-role">${event.coordinator.role}</div>
                  <a href="mailto:${event.coordinator.email}" class="coord-email">${event.coordinator.email}</a>
                </div>
              ` : ''}
              ${event.studentLead ? `
                <div class="coordinator-card">
                  <div class="coord-role">Student Lead</div>
                  <div class="coord-name">${event.studentLead.name}</div>
                  <div class="coord-role">${event.studentLead.role}</div>
                  <a href="mailto:${event.studentLead.email}" class="coord-email">${event.studentLead.email}</a>
                </div>
              ` : ''}
            </div>
          </section>

          <!-- Registration Action Box -->
          <div class="detail-cta-banner">
            <div>
              <h3 class="cta-banner-title">${ctaTitle}</h3>
              <p class="cta-banner-sub">${ctaSub}</p>
            </div>
            <div class="cta-banner-actions">
              ${ctaAction}
              <a href="index.html" class="btn-lg btn-secondary">← Back to All Events</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook registration button to redirect or open registration
    const regBtn = document.getElementById('detailPageRegisterBtn');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        if (!isOpen) {
          if (isOpensSoon) {
            alert(`Registration opens soon for ${event.title}! The registration form is currently locked by the department admin and will open when announced.`);
          } else {
            alert(`Registrations for ${event.title} are currently closed by the department admin.`);
          }
          return;
        }

        if (event.registrationUrl && event.registrationUrl.trim() !== '') {
          window.open(event.registrationUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Open registration on home page with query param
          window.location.href = `index.html#event/${event.id}`;
        }
      });
    }
  }
});
