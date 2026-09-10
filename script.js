/* =========================================================
   ELEMENTS
========================================================= */

const screens =
  document.querySelectorAll(".screen");

const giftButton =
  document.getElementById("giftButton");

const gift =
  document.getElementById("gift");

const letterButton =
  document.getElementById("letterButton");

const memoryButton =
  document.getElementById("memoryButton");

const finalButton =
  document.getElementById("finalButton");

const musicButton =
  document.getElementById("musicButton");

const birthdayMusic =
  document.getElementById("birthdayMusic");

const photoCards =
  document.querySelectorAll(".photo-card");

const photoModal =
  document.getElementById("photoModal");

const modalImage =
  document.getElementById("modalImage");

const modalCaption =
  document.getElementById("modalCaption");

const closeModal =
  document.getElementById("closeModal");


/* =========================================================
   MEMORY ANIMATION STATE
========================================================= */

let memoryAnimationStarted = false;

let musicAnimationFrame = null;


/* =========================================================
   SCREEN TRANSITION
========================================================= */

function showScreen(screenId) {

  screens.forEach((screen) => {

    screen.classList.remove("active");

  });


  const nextScreen =
    document.getElementById(screenId);


  if (nextScreen) {

    nextScreen.classList.add("active");

  }

}


/* =========================================================
   GIFT OPENING
========================================================= */

giftButton.addEventListener(
  "click",
  () => {

    if (
      gift.classList.contains("open")
    ) {
      return;
    }


    /* Open the box */

    gift.classList.add("open");


    /* Effects */

    createBurst();

    createConfetti(90);

    createFloatingHearts(18);


    /*
      Wait for the gift animation
      before changing screen.
    */

    setTimeout(() => {

      showScreen("welcome");

    }, 1300);

  }
);


/* =========================================================
   LETTER
========================================================= */

letterButton.addEventListener(
  "click",
  () => {

    showScreen("letter");

    createFloatingHearts(8);

  }
);


/* =========================================================
   MEMORIES
========================================================= */

memoryButton.addEventListener(
  "click",
  async () => {

    /*
      Show the memories screen first
      so the photos can animate.
    */

    showScreen("memories");

    createFloatingHearts(10);


    /*
      Reset the memory animation
      every time the user enters
      the memories section.
    */

    resetMemoryAnimation();


    /*
      Start the birthday music
      automatically.
    */

    try {

      birthdayMusic.currentTime = 0;

      await birthdayMusic.play();


      /*
        Update music button
      */

      musicButton.textContent =
        "❚❚";

      musicButton.classList.add(
        "playing"
      );


      /*
        Start photo animation
        together with the music.
      */

      startMemoryAnimation();

    } catch (error) {

      console.log(
        "Music could not be played automatically:",
        error
      );

    }

  }
);


/* =========================================================
   MUSIC
========================================================= */

musicButton.addEventListener(
  "click",
  async () => {

    try {

      /*
        If music is paused,
        play it.
      */

      if (
        birthdayMusic.paused
      ) {

        await birthdayMusic.play();


        musicButton.textContent =
          "❚❚";


        musicButton.classList.add(
          "playing"
        );


        /*
          If we are currently
          on the memories screen,
          start the photo animation.
        */

        const memoriesScreen =
          document.getElementById(
            "memories"
          );


        if (
          memoriesScreen &&
          memoriesScreen.classList.contains(
            "active"
          )
        ) {

          memoryAnimationStarted =
            false;

          startMemoryAnimation();

        }

      } else {

        /*
          Pause music
        */

        birthdayMusic.pause();


        musicButton.textContent =
          "▶";


        musicButton.classList.remove(
          "playing"
        );


        /*
          Stop the animation loop
          while music is paused.
        */

        if (
          musicAnimationFrame
        ) {

          cancelAnimationFrame(
            musicAnimationFrame
          );

          musicAnimationFrame =
            null;

        }

      }

    } catch (error) {

      console.log(
        "Music could not be played:",
        error
      );

    }

  }
);


/* =========================================================
   MEMORY ANIMATION
========================================================= */

function resetMemoryAnimation() {

  /*
    Stop previous animation loop
  */

  if (
    musicAnimationFrame
  ) {

    cancelAnimationFrame(
      musicAnimationFrame
    );

    musicAnimationFrame =
      null;

  }


  memoryAnimationStarted =
    false;


  /*
    Reset all photo cards
  */

  photoCards.forEach((card) => {

    card.classList.remove(
      "memory-photo-active"
    );

    card.classList.remove(
      "music-active"
    );

  });

}


/* =========================================================
   START MEMORY ANIMATION
========================================================= */

function startMemoryAnimation() {

  /*
    Prevent duplicate animation
  */

  if (
    memoryAnimationStarted
  ) {

    return;

  }


  memoryAnimationStarted =
    true;


  /*
    Reset all photos
  */

  photoCards.forEach((card) => {

    card.classList.remove(
      "memory-photo-active"
    );

    card.classList.remove(
      "music-active"
    );

  });


  /*
    Force browser to restart
    the CSS animations.
  */

  void document.body.offsetWidth;


  /*
    Animate photos one by one.

    Photo 1 = immediately
    Photo 2 = +700ms
    Photo 3 = +1400ms
    Photo 4 = +2100ms
    Photo 5 = +2800ms
  */

  photoCards.forEach(
    (card, index) => {

      setTimeout(() => {

        /*
          Make sure music animation
          is still running.
        */

        if (
          !birthdayMusic.paused
        ) {

          card.classList.add(
            "memory-photo-active"
          );

        }

      }, index * 700);

    }
  );


  /*
    Start syncing photos
    with the music timeline.
  */

  syncPhotosWithMusic();

}


/* =========================================================
   SYNC PHOTOS WITH MUSIC
========================================================= */

function syncPhotosWithMusic() {

  /*
    Stop when music is paused
    or finished.
  */

  if (
    birthdayMusic.paused ||
    birthdayMusic.ended
  ) {

    memoryAnimationStarted =
      false;

    musicAnimationFrame =
      null;

    return;

  }


  /*
    Current position of song
    in seconds.
  */

  const currentTime =
    birthdayMusic.currentTime;


  /*
    Approximately every 4 seconds,
    another photo becomes the
    main active photo.
  */

  const photoDuration = 4;


  const activeIndex =
    Math.floor(
      currentTime /
      photoDuration
    ) % photoCards.length;


  /*
    Update photo states.
  */

  photoCards.forEach(
    (card, index) => {

      if (
        index === activeIndex
      ) {

        card.classList.add(
          "music-active"
        );

      } else {

        card.classList.remove(
          "music-active"
        );

      }

    }
  );


  /*
    Continue syncing while
    the music is playing.
  */

  musicAnimationFrame =
    requestAnimationFrame(
      syncPhotosWithMusic
    );

}


/* =========================================================
   PHOTO MODAL
========================================================= */

photoCards.forEach((card) => {

  card.addEventListener(
    "click",
    () => {

      const image =
        card.dataset.image;

      const caption =
        card.dataset.caption;


      modalImage.src =
        image;

      modalCaption.textContent =
        caption;


      photoModal.classList.add(
        "active"
      );

    }
  );

});


/* =========================================================
   CLOSE MODAL
========================================================= */

function closePhotoModal() {

  photoModal.classList.remove(
    "active"
  );

}


closeModal.addEventListener(
  "click",
  closePhotoModal
);


photoModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === photoModal
    ) {

      closePhotoModal();

    }

  }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      photoModal.classList.contains(
        "active"
      )
    ) {

      closePhotoModal();

    }

  }
);


/* =========================================================
   FINAL SURPRISE
========================================================= */

finalButton.addEventListener(
  "click",
  () => {

    /*
      Stop memory animation
      when leaving memories.
    */

    if (
      musicAnimationFrame
    ) {

      cancelAnimationFrame(
        musicAnimationFrame
      );

      musicAnimationFrame =
        null;

    }


    showScreen("final");


    /* First celebration */

    createConfetti(160);

    createFloatingHearts(35);

    createBurst();


    /* Second wave */

    setTimeout(() => {

      createConfetti(120);

    }, 1200);


    /* More hearts */

    setTimeout(() => {

      createFloatingHearts(30);

    }, 1800);


    /* Final sparkle */

    setTimeout(() => {

      createBurst();

    }, 2300);

  }
);


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti(
  amount = 80
) {

  const colors = [
    "#c084fc",
    "#e9d5ff",
    "#f0abfc",
    "#a78bfa",
    "#ffffff",
    "#d8b4fe"
  ];


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const confetti =
      document.createElement("div");


    confetti.className =
      "confetti";


    /* Position */

    confetti.style.left =
      Math.random() * 100 +
      "vw";


    /* Color */

    confetti.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    /* Size */

    const size =
      Math.random() * 6 + 5;


    confetti.style.width =
      size + "px";


    confetti.style.height =
      size * 1.7 + "px";


    /* Animation */

    const duration =
      Math.random() * 3 + 3;


    confetti.style.animationDuration =
      duration + "s";


    confetti.style.animationDelay =
      Math.random() * 0.8 +
      "s";


    /* Shape */

    confetti.style.borderRadius =
      Math.random() > 0.5
        ? "50%"
        : "2px";


    document.body.appendChild(
      confetti
    );


    setTimeout(() => {

      confetti.remove();

    }, (duration + 1) * 1000);

  }

}


/* =========================================================
   FLOATING HEARTS
========================================================= */

function createFloatingHearts(
  amount = 10
) {

  const particles = [
    "💜",
    "♡",
    "♥",
    "✦",
    "✧"
  ];


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const particle =
      document.createElement("div");


    particle.className =
      "floating-particle";


    particle.textContent =
      particles[
        Math.floor(
          Math.random() *
          particles.length
        )
      ];


    particle.style.left =
      Math.random() * 100 +
      "vw";


    particle.style.fontSize =
      Math.random() * 15 +
      12 +
      "px";


    const duration =
      Math.random() * 5 + 5;


    particle.style.animationDuration =
      duration + "s";


    particle.style.animationDelay =
      Math.random() * 2 +
      "s";


    document.body.appendChild(
      particle
    );


    setTimeout(() => {

      particle.remove();

    }, (duration + 2) * 1000);

  }

}


/* =========================================================
   BURST
========================================================= */

function createBurst() {

  const burstCount = 40;


  const centerX =
    window.innerWidth / 2;

  const centerY =
    window.innerHeight / 2;


  for (
    let i = 0;
    i < burstCount;
    i++
  ) {

    const particle =
      document.createElement("div");


    particle.className =
      "burst-particle";


    particle.textContent =
      Math.random() > 0.5
        ? "✦"
        : "✧";


    particle.style.left =
      centerX + "px";


    particle.style.top =
      centerY + "px";


    particle.style.color =
      "#e9d5ff";


    particle.style.fontSize =
      Math.random() * 15 +
      10 +
      "px";


    const angle =
      Math.random() *
      Math.PI *
      2;


    const distance =
      Math.random() *
      200 +
      80;


    const x =
      Math.cos(angle) *
      distance;


    const y =
      Math.sin(angle) *
      distance;


    particle.animate(
      [
        {
          transform:
            "translate(-50%, -50%) scale(.2)",

          opacity: 1
        },

        {
          transform:
            `translate(
              calc(-50% + ${x}px),
              calc(-50% + ${y}px)
            )
            scale(1.4)`,

          opacity: 0
        }
      ],
      {
        duration:
          Math.random() *
          700 +
          700,

        easing:
          "cubic-bezier(.2,.8,.2,1)",

        fill:
          "forwards"
      }
    );


    document.body.appendChild(
      particle
    );


    setTimeout(() => {

      particle.remove();

    }, 1700);

  }

}


/* =========================================================
   AMBIENT PARTICLES
========================================================= */

function createAmbientParticles() {

  setInterval(() => {

    if (
      document.visibilityState !==
      "visible"
    ) {

      return;

    }


    const particle =
      document.createElement("div");


    particle.className =
      "floating-particle";


    particle.textContent =
      Math.random() > 0.7
        ? "✦"
        : "·";


    particle.style.left =
      Math.random() * 100 +
      "vw";


    particle.style.fontSize =
      Math.random() * 8 +
      8 +
      "px";


    particle.style.opacity =
      ".3";


    const duration =
      Math.random() * 8 + 8;


    particle.style.animationDuration =
      duration + "s";


    document.body.appendChild(
      particle
    );


    setTimeout(() => {

      particle.remove();

    }, (duration + 2) * 1000);

  }, 1800);

}


/* =========================================================
   START
========================================================= */

createAmbientParticles();


/* =========================================================
   INITIAL EFFECT
========================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      createFloatingHearts(5);

    }, 1200);

  }
);