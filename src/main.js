import "./style.scss";
import { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin } from "gsap/all";
import { replace } from "feather-icons";

replace();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

let smoother = ScrollSmoother.create({
    smooth: 0.75,
    effects: true
})

const loadingScreen = document.querySelector("#loading");

const heroSection = document.querySelector("#hero");
const heroScrolldownBtn = document.querySelector("#hero-scrolldown");

const aboutmeSection = document.querySelector("#aboutme");
const aboutmeCover = document.querySelector("#aboutme-blurCover");
const aboutmeText = document.querySelector("#aboutme > p");

const projectsLabelSection = document.querySelector("#projects-label");
const projectsLabel = projectsLabelSection.querySelector("h2");
const projectsLabelMask = projectsLabelSection.querySelector("#projects-label-mask");

const projectsSection = document.querySelector("#projects");
const projectsCards = document.querySelector("#projects-cards");
const projectsCardsEnd = document.querySelector("#projects-cards-end"); 

const sections = [heroSection, aboutmeSection, projectsLabelSection, projectsSection];

const heroScrolldownSpin = gsap.timeline()
.to(heroScrolldownBtn, { rotation: 360, duration: 0.4, ease: "sine.inOut" })
.set(heroScrolldownBtn, { rotation: 0 })
.pause();

function loadAnimations() {
    gsap.to(heroSection, {
        scrollTrigger: {
            start: "bottom bottom",
            trigger: heroSection,
            endTrigger: heroSection,
            end: "bottom top",
            pin: heroSection,
            scrub: true
        }
    })

    gsap.fromTo(heroSection,
        {
            filter: "blur(0px)",
        },
        {
            scrollTrigger: {
                trigger: aboutmeSection,
                start: "top 25%",
                endTrigger: aboutmeSection,
                end: "top 10%",
                scrub: true
            },
            filter: "blur(3px)"
        }
    )

    gsap.fromTo(aboutmeSection,
        {
            backgroundColor: "rgba(15, 16, 23, 0)"
        },
        {
            scrollTrigger: {
                start: "top 40%",
                trigger: aboutmeSection,
                end: "top top",
                endTrigger: aboutmeSection,
                scrub: true
            },
            backgroundColor: "rgba(15, 16, 23, 1)"
        }
    )

    gsap.fromTo(aboutmeCover,
        {
            backdropFilter: "blur(3px)"
        },
        {
            scrollTrigger: {
                trigger: aboutmeSection,
                start: "top 25%",
                endTrigger: aboutmeSection,
                end: "top 10%",
                scrub: true
            },
            backdropFilter: "blur(0px)",
        }
    )

    gsap.fromTo(projectsLabelMask,
        {
            width: 0,
            borderColor: "hsla(0, 0%, 90%, 30%)",
        },
        {
            scrollTrigger: {
                trigger: aboutmeText,
                start: "bottom top",
                endTrigger: projectsCards,
                end: "top center",
                toggleActions: "restart none none reverse",
            },
            width: projectsLabel.clientWidth,
            duration: 0.25
        }
    )

    gsap.to(projectsLabelSection, {
        scrollTrigger: {
            trigger: projectsLabel,
            start: "center center",
            endTrigger: projectsCards,
            end: "center center",
            scrub: true,
            pin: projectsLabelSection,
        }
    })

    gsap.fromTo(projectsLabel,
        {
            opacity: 1
        },
        {
            scrollTrigger: {
                trigger: projectsCards,
                start: "top bottom",
                endTrigger: projectsCards,
                end: "center center",
                scrub: true
            },
            opacity: 0
        }
    )

    gsap.to(projectsCards, {
        scrollTrigger: {
            scrub: true,
            trigger: projectsCards,
            start: "center center",
            endTrigger: projectsCardsEnd,
            end: "top bottom",
            pin: projectsSection
        },
        ease: "sine.inOut",
        x: -(projectsCards.clientWidth - window.innerWidth)
    })
}

function updateProjectsCards() {
    projectsCardsEnd.style.marginTop = (projectsCards.clientWidth / 2) + "px";
}

function main() {
    loadAnimations();
    updateProjectsCards();
}

heroScrolldownBtn.addEventListener("click", () => {
    heroScrolldownSpin.restart();
    gsap.to(window, {
        delay: 0.1,
        scrollTo: aboutmeSection
    })
})

document.addEventListener("keypress", (ev) => {
    if(ev.key == "e") {
        document.querySelector("#border").innerHTML = document.querySelector("#border").innerHTML ? "" : "* { border: thin solid white }"
    }
})

window.scrollTo(0, 0);

window.addEventListener("resize", updateProjectsCards);
window.addEventListener("load", async () => {
    await gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.25
    })
    document.body.style.overflowY = "auto";
    main();
    ScrollTrigger.refresh();
})