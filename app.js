/**
 * EE - VLSI DESIGN AND TECHNOLOGY
 * Main Application Logic
 * Handles Event Rendering, Filters, Search, Continuous Ticker, Modals, and Registration Flow
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeCategory: 'All Events',
    searchQuery: '',
    selectedEvent: null,
    isTickerPaused: false
  };

  // DOM Elements
  const eventsGridEl = document.getElementById('eventsGrid');
  const emptyStateEl = document.getElementById('eventsEmptyState');
  const resultsMetaEl = document.getElementById('eventsResultsMeta');
  const searchInputEl = document.getElementById('eventSearchInput');
  const searchClearBtnEl = document.getElementById('searchClearBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tickerTrackEl = document.getElementById('tickerTrack');
  const tickerToggleBtn = document.getElementById('tickerToggleBtn');
  
  // Event Details Modal Elements
  const detailsModalBackdrop = document.getElementById('eventDetailsModal');
  const detailsModalCloseBtn = document.getElementById('modalCloseBtn');
  const detailsModalTitle = document.getElementById('modalTitle');
  const detailsModalCategory = document.getElementById('modalCategory');
  const detailsModalBanner = document.getElementById('modalHeaderBanner');
  const detailsModalDate = document.getElementById('modalDate');
  const detailsModalTime = document.getElementById('modalTime');
  const detailsModalVenue = document.getElementById('modalVenue');
  const detailsModalDeadline = document.getElementById('modalDeadline');
  const detailsModalDesc = document.getElementById('modalDesc');
  const detailsModalPrereq = document.getElementById('modalPrereq');
  const detailsModalTools = document.getElementById('modalTools');
  const detailsModalSchedule = document.getElementById('modalSchedule');
  const detailsModalCoordinators = document.getElementById('modalCoordinators');
  const modalRegisterBtn = document.getElementById('modalRegisterBtn');
  const modalDirectPageLink = document.getElementById('modalDirectPageLink');

  // Registration Modal Elements
  const regModalBackdrop = document.getElementById('registrationModal');
  const regModalCloseBtn = document.getElementById('regModalCloseBtn');
  const regEventNameEl = document.getElementById('regEventName');
  const registrationForm = document.getElementById('registrationForm');
  const regSuccessView = document.getElementById('regSuccessView');
  const regFormBody = document.getElementById('regFormBody');
  const regPassEventName = document.getElementById('regPassEventName');
  const regPassStudentName = document.getElementById('regPassStudentName');
  const regPassRoll = document.getElementById('regPassRoll');
  const regPassId = document.getElementById('regPassId');
  const regPassVenue = document.getElementById('regPassVenue');
  const regSuccessCloseBtn = document.getElementById('regSuccessCloseBtn');
  const printPassBtn = document.getElementById('printPassBtn');

  // Mobile Navigation
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  // --------------------------------------------------------------------------
  // 1. Initialize Department Info
  // --------------------------------------------------------------------------
  function initDepartmentInfo() {
    if (typeof DEPARTMENT_CONFIG === 'undefined') return;
    
    // Update text content for elements configured with data-dept-field
    document.querySelectorAll('[data-dept-field]').forEach(el => {
      const field = el.getAttribute('data-dept-field');
      if (DEPARTMENT_CONFIG[field]) {
        el.textContent = DEPARTMENT_CONFIG[field];
      }
    });

    // Update Quick Stats in Hero
    const heroStatsGrid = document.getElementById('heroStatsGrid');
    if (heroStatsGrid && DEPARTMENT_CONFIG.quickStats) {
      heroStatsGrid.innerHTML = DEPARTMENT_CONFIG.quickStats.map(stat => `
        <div class="stat-item">
          <span class="stat-value">${stat.value}</span>
          <span class="stat-label">${stat.label}</span>
        </div>
      `).join('');
    }

    // Update CAD Tools List if present
    const cadToolsTagsList = document.getElementById('cadToolsTagsList');
    if (cadToolsTagsList && DEPARTMENT_CONFIG.cadToolsList) {
      const tools = DEPARTMENT_CONFIG.cadToolsList.split(',').map(s => s.trim()).filter(Boolean);
      cadToolsTagsList.innerHTML = tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
    }

    // Update Registration QR Image if present
    const modalQrImg = document.getElementById('regModalQrImg');
    if (modalQrImg && DEPARTMENT_CONFIG.registrationQrImage) {
      modalQrImg.src = DEPARTMENT_CONFIG.registrationQrImage;
    }
  }

  // --------------------------------------------------------------------------
  // 2. Continuous Scrolling Ticker (Requirement 4)
  // --------------------------------------------------------------------------
  function initTicker() {
    if (!tickerTrackEl || typeof TICKER_ITEMS === 'undefined') return;

    // Create duplicated stream for seamless continuous CSS marquee scroll
    const itemsMarkup = TICKER_ITEMS.map(item => `
      <a href="#event/${item.eventId}" class="ticker-item" data-event-id="${item.eventId}">
        <span class="ticker-item-tag">${item.tag}</span>
        <span>${item.text}</span>
        <span class="ticker-sep">•</span>
      </a>
    `).join('');

    // Duplicate 2-3 times to ensure wide screens are completely filled without blanks
    tickerTrackEl.innerHTML = itemsMarkup + itemsMarkup + itemsMarkup;

    // Event delegation for ticker clicks
    tickerTrackEl.addEventListener('click', (e) => {
      const tickerLink = e.target.closest('.ticker-item');
      if (tickerLink) {
        e.preventDefault();
        const eventId = tickerLink.getAttribute('data-event-id');
        openEventDetails(eventId);
      }
    });

    // Ticker Play/Pause Toggle Button
    if (tickerToggleBtn) {
      tickerToggleBtn.addEventListener('click', () => {
        state.isTickerPaused = !state.isTickerPaused;
        if (state.isTickerPaused) {
          tickerTrackEl.classList.add('paused');
          tickerToggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>`;
          tickerToggleBtn.setAttribute('title', 'Resume Scrolling Ticker');
          tickerToggleBtn.setAttribute('aria-label', 'Resume Scrolling Ticker');
        } else {
          tickerTrackEl.classList.remove('paused');
          tickerToggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>`;
          tickerToggleBtn.setAttribute('title', 'Pause Scrolling Ticker');
          tickerToggleBtn.setAttribute('aria-label', 'Pause Scrolling Ticker');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. Render Upcoming & Completed Event Cards (Requirements 1, 2, 3)
  // --------------------------------------------------------------------------
  function getSafeEventsData() {
    if (typeof EVENTS_DATA !== 'undefined' && Array.isArray(EVENTS_DATA) && EVENTS_DATA.length > 0) {
      return EVENTS_DATA;
    }
    if (typeof window !== 'undefined' && window.EVENTS_DATA && Array.isArray(window.EVENTS_DATA) && window.EVENTS_DATA.length > 0) {
      return window.EVENTS_DATA;
    }
    if (typeof DEFAULT_EVENTS_DATA !== 'undefined' && Array.isArray(DEFAULT_EVENTS_DATA)) {
      return DEFAULT_EVENTS_DATA;
    }
    return [];
  }

  // Registration Access Gatekeeper: verifies whether the registration form is permitted to open
  function isRegistrationAllowed(event) {
    if (!event) return false;
    if (event.status === 'Completed') return false;

    // Check Master Registration Access from departmentConfig
    if (typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.masterRegAccess) {
      if (DEPARTMENT_CONFIG.masterRegAccess === 'closed') return false;
      if (DEPARTMENT_CONFIG.masterRegAccess === 'opens_soon') return false;
      if (DEPARTMENT_CONFIG.masterRegAccess === 'open') return true;
    }

    // Check Event's own regControl
    if (event.regControl === 'open' || (event.status === 'Open' && !event.registrationClosed)) {
      return true;
    }
    if (event.regControl === 'opens_soon' || event.status === 'Coming Soon' || event.status === 'Opens Soon') {
      return false;
    }
    if (event.regControl === 'closed' || event.status === 'Closed' || event.registrationClosed === true) {
      return false;
    }

    return false;
  }

  function renderSingleCard(event) {
    if (!event) return '';

    // Defensive theme fallback
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
    } catch(err) {
      console.warn('SVG Illustration note:', err);
    }

    // Status badge & action button
    const isAllowed = isRegistrationAllowed(event);
    const isOpensSoon = (!isAllowed && (event.regControl === 'opens_soon' || event.status === 'Coming Soon' || event.status === 'Opens Soon'));
    const isClosed = (!isAllowed && !isOpensSoon && event.status !== 'Completed');

    let statusBadge = '';
    let actionBtn = '';

    if (event.status === 'Completed') {
      statusBadge = `<span class="card-status-badge status-completed">✅ Event Completed</span>`;
      actionBtn = `<span class="btn-status-completed">Completed</span>`;
    } else if (isAllowed) {
      statusBadge = `<span class="card-status-badge" style="background:#ecfdf5; color:#047857; border: 1px solid #a7f3d0;">🟢 Registration Open</span>`;
      actionBtn = `
        <button 
          type="button" 
          class="card-quick-reg-btn" 
          data-action="register" 
          data-event-id="${event.id}"
          aria-label="Quick register for ${event.title}"
        >
          Register
        </button>`;
    } else if (isOpensSoon) {
      statusBadge = `<span class="card-status-badge status-coming-soon">🔥 Opens Soon</span>`;
      actionBtn = `
        <button 
          type="button" 
          class="card-quick-reg-btn btn-coming-soon" 
          data-action="register" 
          data-event-id="${event.id}"
          aria-label="${event.title} - Opens Soon"
        >
          Opens Soon
        </button>`;
    } else {
      statusBadge = `<span class="card-status-badge" style="background:#fee2e2; color:#b91c1c; border: 1px solid #fca5a5;">🔴 Registration Closed</span>`;
      actionBtn = `
        <button 
          type="button" 
          class="card-quick-reg-btn btn-reg-closed" 
          data-action="register" 
          data-event-id="${event.id}"
          style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; cursor: not-allowed;"
          title="Registrations are closed for this event"
        >
          Registration Closed
        </button>`;
    }

    return `
      <article 
        class="event-card" 
        role="button" 
        tabindex="0" 
        data-event-id="${event.id}"
        aria-label="${event.title}, Status: ${event.statusLabel || event.eventDate}"
      >
        <!-- Distinct Themed Background / 16:9 Aspect Ratio Event Poster -->
        <div class="card-header-art">
          ${event.posterImage ? `
            <img src="${event.posterImage}" alt="${event.title} Poster" class="card-poster-img" style="object-fit: ${event.posterFit || 'cover'};">
            <div class="card-poster-overlay"></div>
          ` : bgSvg}
          <span class="card-category-tag">${event.categoryLabel || event.category}</span>
          ${statusBadge}
        </div>

        <div class="card-body">
          <h3 class="card-title">${event.title}</h3>
          <p class="card-summary">${event.shortSummary || ''}</p>

          <div class="card-meta-list">
            <!-- Event Date -->
            <div class="card-meta-row">
              <svg class="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span><span class="meta-label">Date:</span> ${event.eventDate || 'Scheduled'}</span>
            </div>

            <!-- Venue -->
            <div class="card-meta-row">
              <svg class="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span><span class="meta-label">Venue:</span> ${event.venue || 'Campus CAD Lab'}</span>
            </div>

            <!-- Registration Status / Deadline -->
            <div class="card-meta-row">
              <svg class="card-meta-icon" style="color: ${event.status === 'Completed' ? '#64748b' : (isClosed ? '#ef4444' : '#d97706')};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <span class="meta-label">Registration:</span>
                <span class="deadline-badge" style="${event.status === 'Completed' ? 'background: #f1f5f9; color: #475569; border-color: #cbd5e1;' : (isClosed ? 'background: #fee2e2; color: #b91c1c; border-color: #fca5a5;' : (event.status === 'Coming Soon' ? 'background: #fef2f2; color: #b91c1c; border-color: #fecaca;' : ''))}">${isClosed ? 'Registrations Closed' : (event.registrationDeadline || 'Active')}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="card-view-details-link">
              View Event Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            ${actionBtn}
          </div>
        </div>
      </article>
    `;
  }

  function renderEvents() {
    if (!eventsGridEl) return;
    const allEvents = getSafeEventsData();

    // Filter by Category and Search query
    const filteredEvents = allEvents.filter(event => {
      let matchesCategory = true;
      if (state.activeCategory === 'All Events') {
        matchesCategory = true;
      } else if (state.activeCategory === 'Upcoming') {
        matchesCategory = (event.status !== 'Completed');
      } else if (state.activeCategory === 'Completed') {
        matchesCategory = (event.status === 'Completed');
      } else {
        matchesCategory = (event.category === state.activeCategory);
      }
      
      const query = state.searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        (event.title && event.title.toLowerCase().includes(query)) ||
        (event.shortSummary && event.shortSummary.toLowerCase().includes(query)) ||
        (event.venue && event.venue.toLowerCase().includes(query)) ||
        (event.status && event.status.toLowerCase().includes(query)) ||
        (event.edaTools && event.edaTools.some(tool => tool.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });

    // Update Results Meta
    if (resultsMetaEl) {
      resultsMetaEl.textContent = `Showing ${filteredEvents.length} of ${allEvents.length} events`;
    }

    // Update Category Badges Counts
    updateFilterCounts();

    // Handle Empty State
    if (filteredEvents.length === 0) {
      eventsGridEl.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    // If viewing "All Events" and no active search query: show clear distinct sections for Upcoming and Completed!
    if (state.activeCategory === 'All Events' && !state.searchQuery) {
      const upcomingEvents = filteredEvents.filter(e => e.status !== 'Completed');
      const completedEvents = filteredEvents.filter(e => e.status === 'Completed');

      let html = '';

      if (upcomingEvents.length > 0) {
        html += `
          <div class="events-group-block" id="upcomingEventsAnchor">
            <div class="events-group-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="group-header-pill" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;">🔥 Active & Upcoming</span>
                <h3 class="events-group-title">Upcoming Department Events</h3>
              </div>
              <span class="events-group-meta">${upcomingEvents.length} Active Event${upcomingEvents.length > 1 ? 's' : ''} • Registration Open</span>
            </div>
            <div class="events-subgrid">
              ${upcomingEvents.map(renderSingleCard).join('')}
            </div>
          </div>
        `;
      }

      if (completedEvents.length > 0) {
        html += `
          <div class="events-group-block" id="completedEventsAnchor" style="margin-top: 1rem;">
            <div class="events-group-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="group-header-pill" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">✅ Completed Events & Archive</span>
                <h3 class="events-group-title">Completed Department Events</h3>
              </div>
              <span class="events-group-meta">${completedEvents.length} Event${completedEvents.length > 1 ? 's' : ''} Successfully Concluded</span>
            </div>
            <div class="events-subgrid">
              ${completedEvents.map(renderSingleCard).join('')}
            </div>
          </div>
        `;
      }

      eventsGridEl.innerHTML = html;
    } else {
      // Direct grid view for specific category or search results
      eventsGridEl.innerHTML = `
        <div class="events-subgrid">
          ${filteredEvents.map(renderSingleCard).join('')}
        </div>
      `;
    }

    // Attach card click & keyboard listeners
    attachCardListeners();
  }

  // Update counts on filter buttons
  function updateFilterCounts() {
    const allEvents = getSafeEventsData();
    filterBtns.forEach(btn => {
      const category = btn.getAttribute('data-category');
      let count = 0;
      if (category === 'All Events') {
        count = allEvents.length;
      } else if (category === 'Upcoming') {
        count = allEvents.filter(ev => ev.status !== 'Completed').length;
      } else if (category === 'Completed') {
        count = allEvents.filter(ev => ev.status === 'Completed').length;
      } else {
        count = allEvents.filter(ev => ev.category === category).length;
      }
      const countEl = btn.querySelector('.filter-count-badge');
      if (countEl) {
        countEl.textContent = count;
      }
    });
  }

  // Attach click and keyboard handlers to event cards
  function attachCardListeners() {
    const cards = eventsGridEl.querySelectorAll('.event-card');
    cards.forEach(card => {
      const eventId = card.getAttribute('data-event-id');

      // Click event
      card.addEventListener('click', (e) => {
        // If user clicked the Quick Register button inside card
        if (e.target.closest('[data-action="register"]')) {
          e.stopPropagation();
          const targetEvent = getEventById(eventId);
          if (targetEvent) {
            handleRegistrationInitiation(targetEvent);
          }
          return;
        }

        openEventDetails(eventId);
      });

      // Keyboard accessible (Enter or Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEventDetails(eventId);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Open Dedicated Event Details View (Requirement 4)
  // --------------------------------------------------------------------------
  function openEventDetails(eventId) {
    const event = getEventById(eventId);
    if (!event) return;

    state.selectedEvent = event;

    // Update URL hash without jumping page scroll
    history.replaceState(null, '', `#event/${event.id}`);

    // Populate Modal Header Banner
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
    // Status badge representation in modal banner
    const statusPill = event.status === 'Completed'
      ? `<span class="card-status-badge status-completed" style="margin-bottom: 0.35rem;">✅ Event Completed</span>`
      : (event.status === 'Coming Soon' || event.status === 'Opens Soon'
          ? `<span class="card-status-badge status-coming-soon" style="margin-bottom: 0.35rem;">🔥 Opens Soon</span>`
          : `<span class="card-status-badge" style="background:#ecfdf5; color:#047857; border: 1px solid #a7f3d0; margin-bottom: 0.35rem;">Registration Open</span>`);

    detailsModalBanner.innerHTML = `
      ${bgSvg}
      <div class="modal-banner-top">
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <span class="modal-category-badge">${event.categoryLabel || event.category}</span>
          ${statusPill}
        </div>
        <button type="button" class="modal-close-btn" id="modalTopCloseBtn" aria-label="Close event details">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-banner-bottom">
        <h2 class="modal-title" id="modalTitleText">${event.title}</h2>
      </div>
    `;

    // Hook the dynamic close button inside header banner
    const topCloseBtn = document.getElementById('modalTopCloseBtn');
    if (topCloseBtn) {
      topCloseBtn.addEventListener('click', closeEventDetails);
    }

    // Setup 16:9 Aspect Ratio Event Poster in details modal
    const modalPosterBox = document.getElementById('modalPosterBox');
    const modalPosterImg = document.getElementById('modalPosterImg');
    if (modalPosterBox && modalPosterImg) {
      if (event.posterImage) {
        modalPosterImg.src = event.posterImage;
        modalPosterImg.style.objectFit = event.posterFit || 'cover';
        modalPosterBox.style.display = 'block';
      } else {
        modalPosterBox.style.display = 'none';
      }
    }

    // Populate Key Information Bar
    detailsModalDate.textContent = event.eventDate;
    detailsModalTime.textContent = event.eventTime;
    detailsModalVenue.textContent = event.venue;
    detailsModalDeadline.textContent = event.registrationDeadline;

    // Populate Description & Overview
    detailsModalDesc.textContent = event.description;
    detailsModalPrereq.textContent = event.prerequisites || "None specified. Open to interested students.";

    // Populate EDA Tools
    if (event.edaTools && event.edaTools.length > 0) {
      detailsModalTools.innerHTML = event.edaTools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
    } else {
      detailsModalTools.innerHTML = `<span class="tool-tag">Standard Laboratory Software</span>`;
    }

    // Populate Detailed Schedule (Requirement 4)
    if (event.schedule && event.schedule.length > 0) {
      detailsModalSchedule.innerHTML = event.schedule.map(item => `
        <div class="timeline-row">
          <span class="timeline-time">${item.time}</span>
          <span class="timeline-topic">${item.topic}</span>
        </div>
      `).join('');
    } else {
      detailsModalSchedule.innerHTML = `<p class="modal-p">Detailed session timetable will be handed out during opening registration.</p>`;
    }

    // Populate Coordinators
    if (event.coordinator || event.studentLead) {
      let coordsHtml = '';
      if (event.coordinator) {
        coordsHtml += `
          <div class="coordinator-card">
            <div class="coord-role">Faculty Coordinator</div>
            <div class="coord-name">${event.coordinator.name}</div>
            <div class="coord-role">${event.coordinator.role}</div>
            <a href="mailto:${event.coordinator.email}" class="coord-email">${event.coordinator.email}</a>
          </div>
        `;
      }
      if (event.studentLead) {
        coordsHtml += `
          <div class="coordinator-card">
            <div class="coord-role">Student Coordinator</div>
            <div class="coord-name">${event.studentLead.name}</div>
            <div class="coord-role">${event.studentLead.role}</div>
            <a href="mailto:${event.studentLead.email}" class="coord-email">${event.studentLead.email}</a>
          </div>
        `;
      }
      detailsModalCoordinators.innerHTML = coordsHtml;
    }

    // Update Standalone Page Link
    if (modalDirectPageLink) {
      modalDirectPageLink.href = `event-details.html?id=${encodeURIComponent(event.id)}`;
    }

    // Registration Button setup
    if (modalRegisterBtn) {
      const isAllowed = isRegistrationAllowed(event);
      if (event.status === 'Completed') {
        modalRegisterBtn.textContent = 'Event Concluded (Closed)';
        modalRegisterBtn.className = 'btn-lg btn-secondary';
        modalRegisterBtn.onclick = () => {
          showToast('This event concluded successfully. Check out VELTRAXX 2.0!', 'info');
        };
      } else if (isAllowed) {
        modalRegisterBtn.textContent = 'Register for this Event';
        modalRegisterBtn.className = 'btn-lg btn-primary';
        modalRegisterBtn.onclick = () => {
          closeEventDetails();
          handleRegistrationInitiation(event);
        };
      } else if (event.regControl === 'opens_soon' || event.status === 'Coming Soon' || event.status === 'Opens Soon') {
        modalRegisterBtn.textContent = '🔥 Opens Soon (Registration Locked)';
        modalRegisterBtn.className = 'btn-lg btn-secondary';
        modalRegisterBtn.onclick = () => {
          const msg = (typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.regOpensSoonMessage) || 
            `Registration opens soon for ${event.title}! The registration form is currently locked by the department admin and will open when announced.`;
          showToast(msg, 'warning');
        };
      } else {
        modalRegisterBtn.textContent = 'Registration Closed';
        modalRegisterBtn.className = 'btn-lg btn-secondary';
        modalRegisterBtn.onclick = () => {
          showToast(`Registrations for ${event.title} are currently closed by the department admin.`, 'warning');
        };
      }
    }

    // Display Modal
    detailsModalBackdrop.classList.add('is-open');
    detailsModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    if (topCloseBtn) topCloseBtn.focus();
  }

  function closeEventDetails() {
    detailsModalBackdrop.classList.remove('is-open');
    detailsModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Clear hash without reload
    if (window.location.hash.startsWith('#event/')) {
      history.replaceState(null, '', window.location.pathname);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Registration Flow (Modal & External URL handling)
  // --------------------------------------------------------------------------
  function handleRegistrationInitiation(event) {
    if (event.status === 'Completed') {
      showToast('This event has already concluded. Stay tuned for upcoming editions!', 'info');
      return;
    }

    if (!isRegistrationAllowed(event)) {
      if (event.regControl === 'opens_soon' || event.status === 'Coming Soon' || event.status === 'Opens Soon') {
        const msg = (typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.regOpensSoonMessage) || 
          `Registration opens soon for ${event.title}! The registration form is currently locked by the department admin and will open when announced.`;
        showToast(msg, 'warning');
      } else {
        showToast(`Registrations for "${event.title}" are currently closed by the department admin.`, 'warning');
      }
      return; // Strictly blocks the form from opening!
    }

    // If the event specifies an external registration link (e.g. Google Form)
    if (event.registrationUrl && event.registrationUrl.trim() !== '') {
      showToast(`Redirecting to registration portal for ${event.title}...`, 'info');
      window.open(event.registrationUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Only when registration is allowed does the form open!
    state.selectedEvent = event;
    openRegistrationModal(event);
  }

  function openRegistrationModal(event) {
    if (!regModalBackdrop) return;
    if (!isRegistrationAllowed(event)) {
      showToast(`Registration opens soon for ${event.title}. Registration form is currently locked.`, 'warning');
      return;
    }

    regEventNameEl.textContent = event.title;

    // Dynamically set text name for the form
    const formTitleEl = document.getElementById('regModalTitle');
    if (formTitleEl) {
      formTitleEl.textContent = event.formName || (typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.regFormTitle) || 'Event Registration';
    }
    const formSupertitleEl = document.querySelector('#registrationModal .brand-supertitle');
    if (formSupertitleEl && typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.regFormSupertitle) {
      formSupertitleEl.textContent = DEPARTMENT_CONFIG.regFormSupertitle;
    }
    
    // Dynamically update QR code image and instructions from department config
    const modalQrImg = document.getElementById('regModalQrImg');
    const modalQrInstructions = document.getElementById('regQrInstructions');
    if (modalQrImg && typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.registrationQrImage) {
      modalQrImg.src = DEPARTMENT_CONFIG.registrationQrImage;
    }
    if (modalQrInstructions && typeof DEPARTMENT_CONFIG !== 'undefined' && DEPARTMENT_CONFIG.registrationQrInstructions) {
      modalQrInstructions.textContent = DEPARTMENT_CONFIG.registrationQrInstructions;
    }

    // Render Dynamic Custom Fields Configured by Admin
    renderDynamicFormFields();

    // Reset view
    registrationForm.reset();
    regFormBody.style.display = 'block';
    regSuccessView.style.display = 'none';

    regModalBackdrop.classList.add('is-open');
    regModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstInput = registrationForm.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  // Render Custom Questions / Fields added via Admin Portal
  function renderDynamicFormFields() {
    const container = document.getElementById('dynamicFormFieldsContainer');
    if (!container) return;

    // Apply custom standard labels if configured
    if (typeof DEPARTMENT_CONFIG !== 'undefined') {
      const lblName = document.getElementById('lblFullName');
      if (lblName && DEPARTMENT_CONFIG.labelFullName) {
        lblName.innerHTML = `${DEPARTMENT_CONFIG.labelFullName} <span class="required-mark">*</span>`;
      }
      const lblEmail = document.getElementById('lblEmail');
      if (lblEmail && DEPARTMENT_CONFIG.labelEmail) {
        lblEmail.innerHTML = `${DEPARTMENT_CONFIG.labelEmail} <span class="required-mark">*</span>`;
      }
      const lblCollege = document.getElementById('lblCollege');
      if (lblCollege && DEPARTMENT_CONFIG.labelCollege) {
        lblCollege.innerHTML = `${DEPARTMENT_CONFIG.labelCollege} <span class="required-mark">*</span>`;
      }
      const lblYear = document.getElementById('lblYear');
      if (lblYear && DEPARTMENT_CONFIG.labelYear) {
        lblYear.innerHTML = `${DEPARTMENT_CONFIG.labelYear} <span class="required-mark">*</span>`;
      }
      const lblTxn = document.getElementById('lblTransactionId');
      if (lblTxn && DEPARTMENT_CONFIG.labelTransactionId) {
        lblTxn.textContent = DEPARTMENT_CONFIG.labelTransactionId;
      }
      const inpTxn = document.getElementById('regTransactionId');
      if (inpTxn && DEPARTMENT_CONFIG.placeholderTransactionId) {
        inpTxn.placeholder = DEPARTMENT_CONFIG.placeholderTransactionId;
      }
      const submitBtn = document.getElementById('regSubmitBtn');
      if (submitBtn && DEPARTMENT_CONFIG.regSubmitBtnText) {
        submitBtn.textContent = DEPARTMENT_CONFIG.regSubmitBtnText;
      }
    }

    const fields = (typeof DEPARTMENT_CONFIG !== 'undefined' && Array.isArray(DEPARTMENT_CONFIG.customFormFields)) 
      ? DEPARTMENT_CONFIG.customFormFields 
      : [];
    
    if (fields.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = fields.map(f => {
      const isReq = f.required ? 'required' : '';
      const reqMark = f.required ? '<span class="required-mark">*</span>' : '';
      if (f.type === 'select') {
        const opts = (f.options || '').split(',').map(o => o.trim()).filter(Boolean);
        return `
          <div class="form-group dept-form-full">
            <label for="custom_${f.id}" class="form-label">${f.label} ${reqMark}</label>
            <select id="custom_${f.id}" class="form-select custom-dyn-input" ${isReq}>
              <option value="">-- Select ${f.label} --</option>
              ${opts.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>
        `;
      }
      return `
        <div class="form-group dept-form-full">
          <label for="custom_${f.id}" class="form-label">${f.label} ${reqMark}</label>
          <input type="${f.type || 'text'}" id="custom_${f.id}" class="form-input custom-dyn-input" placeholder="${f.placeholder || ''}" ${isReq}>
        </div>
      `;
    }).join('');
  }

  function closeRegistrationModal() {
    if (!regModalBackdrop) return;
    regModalBackdrop.classList.remove('is-open');
    regModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Handle Form Submission with Pending Admin Approval Workflow
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const collegeName = document.getElementById('regCollegeName').value.trim();
      const studyingYear = document.getElementById('regYear').value;
      const txnInput = document.getElementById('regTransactionId') || document.getElementById('regUtrNo');
      const transactionId = txnInput ? txnInput.value.trim() : '';
      const event = state.selectedEvent;

      if (!fullName || !email || !collegeName) {
        showToast('Please fill in your Name, Email, and College Name.', 'warning');
        return;
      }

      // Collect Custom Dynamic Form Fields
      const customAnswers = {};
      if (typeof DEPARTMENT_CONFIG !== 'undefined' && Array.isArray(DEPARTMENT_CONFIG.customFormFields)) {
        DEPARTMENT_CONFIG.customFormFields.forEach(f => {
          const el = document.getElementById(`custom_${f.id}`);
          if (el) {
            customAnswers[f.label || f.id] = el.value.trim();
          }
        });
      }

      // Generate a pending verification registration token
      const regId = 'PENDING-VLSI-' + Math.floor(100000 + Math.random() * 900000);

      const regRecord = {
        id: regId,
        name: fullName,
        email: email,
        college: collegeName,
        year: studyingYear,
        transactionId: transactionId,
        utr: transactionId, // Backwards compatibility
        customFields: customAnswers,
        event: event ? event.title : 'Department Event',
        eventId: event ? event.id : '',
        status: 'Pending Approval', // Requires coordinator approval from admin portal
        timestamp: new Date().toLocaleString()
      };

      // Populate Success View Pass
      if (document.getElementById('regPassEventName')) document.getElementById('regPassEventName').textContent = regRecord.event;
      if (document.getElementById('regPassStudentName')) document.getElementById('regPassStudentName').textContent = fullName;
      if (document.getElementById('regPassEmail')) document.getElementById('regPassEmail').textContent = email;
      if (document.getElementById('regPassCollege')) document.getElementById('regPassCollege').textContent = collegeName;
      if (document.getElementById('regPassYear')) document.getElementById('regPassYear').textContent = studyingYear;
      if (document.getElementById('regPassTxnId')) document.getElementById('regPassTxnId').textContent = transactionId || 'Not Provided';
      if (document.getElementById('regPassId')) document.getElementById('regPassId').textContent = regId;

      // Save registration for Admin Portal
      try {
        const stored = localStorage.getItem('vlsi_registrations');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(regRecord);
        localStorage.setItem('vlsi_registrations', JSON.stringify(list));

        // Sync with server if available
        fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(regRecord)
        }).catch(() => {});
      } catch(err) {
        console.warn('Registration save note:', err);
      }

      // Switch to Pending Confirmation View
      regFormBody.style.display = 'none';
      regSuccessView.style.display = 'block';

      showToast(`Registration Submitted! Verification Token: ${regId}`, 'info');
    });
  }

  // Print / Save Registration Pass
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (regSuccessCloseBtn) {
    regSuccessCloseBtn.addEventListener('click', closeRegistrationModal);
  }

  // --------------------------------------------------------------------------
  // 6. Filter & Search Controls (Requirement 6)
  // --------------------------------------------------------------------------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.activeCategory = btn.getAttribute('data-category');
      renderEvents();
    });
  });

  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtnEl) {
        searchClearBtnEl.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderEvents();
    });
  }

  if (searchClearBtnEl) {
    searchClearBtnEl.addEventListener('click', () => {
      searchInputEl.value = '';
      state.searchQuery = '';
      searchClearBtnEl.style.display = 'none';
      searchInputEl.focus();
      renderEvents();
    });
  }

  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'All Events';
      if (searchInputEl) searchInputEl.value = '';
      if (searchClearBtnEl) searchClearBtnEl.style.display = 'none';
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'All Events');
      });
      renderEvents();
    });
  }

  // --------------------------------------------------------------------------
  // 7. Modal Listeners & Accessibility
  // --------------------------------------------------------------------------
  if (detailsModalCloseBtn) {
    detailsModalCloseBtn.addEventListener('click', closeEventDetails);
  }

  if (detailsModalBackdrop) {
    detailsModalBackdrop.addEventListener('click', (e) => {
      if (e.target === detailsModalBackdrop) {
        closeEventDetails();
      }
    });
  }

  if (regModalCloseBtn) {
    regModalCloseBtn.addEventListener('click', closeRegistrationModal);
  }

  if (regModalBackdrop) {
    regModalBackdrop.addEventListener('click', (e) => {
      if (e.target === regModalBackdrop) {
        closeRegistrationModal();
      }
    });
  }

  // Global Escape Key Listener for Modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (regModalBackdrop && regModalBackdrop.classList.contains('is-open')) {
        closeRegistrationModal();
      } else if (detailsModalBackdrop && detailsModalBackdrop.classList.contains('is-open')) {
        closeEventDetails();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 8. Mobile Menu Toggle
  // --------------------------------------------------------------------------
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('mobile-open');
    });

    // Close mobile nav on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 10. URL Hash Route Inspection (e.g. #event/vlsi-tapeout-2026)
  // --------------------------------------------------------------------------
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#event/')) {
      const eventId = hash.replace('#event/', '');
      openEventDetails(eventId);
    }
  }

  // --------------------------------------------------------------------------
  // Initialize Application
  // --------------------------------------------------------------------------
  initDepartmentInfo();
  initTicker();
  renderEvents();
  checkUrlHash();

  window.addEventListener('hashchange', checkUrlHash);

  // Sticky header shadow effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }
  }, { passive: true });
});
