(function() {
  'use strict';

  /* ── Live Race Schedule (auto year) ── */
  const raceSchedule = [
    { round: 1,  gp: "Australian GP",       month: 3,  day: 16 },
    { round: 2,  gp: "Chinese GP",          month: 3,  day: 23 },
    { round: 3,  gp: "Japanese GP",         month: 4,  day: 6 },
    { round: 4,  gp: "Bahrain GP",          month: 4,  day: 13 },
    { round: 5,  gp: "Saudi Arabian GP",    month: 4,  day: 20 },
    { round: 6,  gp: "Miami GP",            month: 5,  day: 4 },
    { round: 7,  gp: "Emilia Romagna GP",   month: 5,  day: 18 },
    { round: 8,  gp: "Monaco GP",           month: 5,  day: 25 },
    { round: 9,  gp: "Canadian GP",         month: 6,  day: 22 },
    { round: 10, gp: "Spanish GP",          month: 6,  day: 29 },
    { round: 11, gp: "Austrian GP",         month: 7,  day: 6 },
    { round: 12, gp: "British GP",          month: 7,  day: 13 },
    { round: 13, gp: "Hungarian GP",        month: 7,  day: 27 },
    { round: 14, gp: "Belgian GP",          month: 8,  day: 3 },
    { round: 15, gp: "Dutch GP",            month: 8,  day: 31 },
    { round: 16, gp: "Italian GP",          month: 9,  day: 7 },
    { round: 17, gp: "Azerbaijan GP",       month: 9,  day: 21 },
    { round: 18, gp: "Singapore GP",        month: 10, day: 5 },
    { round: 19, gp: "United States GP",    month: 10, day: 19 },
    { round: 20, gp: "Mexico GP",           month: 10, day: 26 },
    { round: 21, gp: "Brazil GP",           month: 11, day: 9 },
    { round: 22, gp: "Las Vegas GP",        month: 11, day: 22 },
    { round: 23, gp: "Qatar GP",            month: 11, day: 30 },
    { round: 24, gp: "Abu Dhabi GP",        month: 12, day: 14 }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function buildRaceTable() {
    const tbody = document.getElementById("raceBody");
    if (!tbody) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    let nextFound = false;
    let allFinished = true;

    const lastRaceDate = new Date(currentYear, 11, 14);
    const scheduleYear = today > lastRaceDate ? currentYear + 1 : currentYear;

    const scheduleHeading = document.getElementById("scheduleYear");
    if (scheduleHeading) {
      scheduleHeading.textContent = `${scheduleYear} Race Schedule`;
    }

    tbody.innerHTML = "";

    raceSchedule.forEach(race => {
      const raceDate = new Date(scheduleYear, race.month - 1, race.day);
      const isPast = raceDate < today;

      if (!isPast) allFinished = false;

      let statusClass = "";
      let statusText = "";

      if (isPast) {
        statusClass = "finished";
        statusText = "Finished";
      } else if (!nextFound) {
        statusClass = "next";
        statusText = "Up Next";
        nextFound = true;
      } else {
        statusClass = "";
        statusText = "Upcoming";
      }

      const formattedDate = `${monthNames[race.month - 1]} ${race.day}, ${scheduleYear}`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${race.round}</td>
        <td>${race.gp}</td>
        <td>${formattedDate}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
      `;
      tbody.appendChild(tr);
    });

    if (allFinished && tbody.lastChild) {
      const lastRow = tbody.lastChild;
      lastRow.querySelector("td:last-child").innerHTML = `<span class="finished">Season Complete</span>`;
    }
  }

  /* ── Animated Counters ── */
  const counters = document.querySelectorAll(".lh44-stat-card h3");
  let started = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = Number(counter.dataset.target);
      let current = 0;
      const increment = Math.ceil(target / 70);

      const update = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + "+";
        } else {
          counter.textContent = current;
          requestAnimationFrame(update);
        }
      };
      update();
    });
  }

  /* ── Scroll trigger for counters ── */
  function handleScroll() {
    const statsSection = document.querySelector(".lh44-stats");
    if (!statsSection) return;
    const sectionTop = statsSection.getBoundingClientRect().top;

    if (!started && sectionTop < window.innerHeight - 100) {
      started = true;
      animateCounters();
      window.removeEventListener("scroll", handleScroll);
    }
  }

  /* ── Contact form handler ── */
  const contactForm = document.getElementById("lh44ContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Thank you for joining the LH44 community!");
      this.reset();
    });
  }

  /* ── Initialize on DOM ready ── */
  function init() {
    buildRaceTable();
    window.addEventListener("scroll", handleScroll);
    // Check initial position
    handleScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();