import "./style.scss";
import { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin } from "gsap/all";
import { replace } from "feather-icons";

replace();
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

let smoother = ScrollSmoother.create({
    smooth: 0.75,
    effects: true
})

const heroSection = document.querySelector("#hero");
const heroScrolldownBtn = document.querySelector("#hero-scrolldown");

const aboutmeSection = document.querySelector("#aboutme");
const aboutmeCover = document.querySelector("#aboutme-blurCover");

const projectsLabelSection = document.querySelector("#projects-label");
const projectsLabel = projectsLabelSection.querySelector("h2");
console.log(projectsLabel)
const projectsSection = document.querySelector("#projects");
const projectsCards = document.querySelector("#projects-cards");
const projectsCardsEnd = document.querySelector("#projects-cards-end"); 

const sections = [heroSection, aboutmeSection, projectsLabelSection, projectsSection];

const heroScrolldownSpin = gsap.timeline()
.to(heroScrolldownBtn, { rotation: 360, duration: 0.4, ease: "sine.inOut" })
.set(heroScrolldownBtn, { rotation: 0 })
.pause();

const heroScrolldown = gsap.timeline()
.to(heroSection, {
    scrollTrigger: {
        start: "bottom bottom",
        trigger: heroSection,
        endTrigger: heroSection,
        end: "bottom top",
        pin: heroSection,
        scrub: true,
        markers: true
    }
})
.fromTo(heroSection,
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
.fromTo(aboutmeSection,
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
.fromTo(aboutmeCover,
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

const projectsLabelScrolldown = gsap.timeline({
    scrollTrigger: {
        trigger: projectsLabel,
        start: "center center",
        endTrigger: projectsSection,
        end: "top top",
        pin: projectsLabelSection,
        scrub: true
    }
})
.from(projectsLabel, {
    opacity: 0
})
.to(projectsLabel, {
    opacity: 1
})
.from(projectsLabel, {
    opacity: 1
})
.to(projectsLabel, {
    opacity: 0
})
const projectsCardsScrolldown = gsap.timeline({
    scrollTrigger: {
        scrub: true,
        trigger: projectsCards,
        start: "center center",
        endTrigger: projectsCardsEnd,
        end: "top bottom",
        pin: projectsSection
    }
})
.to(projectsCards, {
    ease: "sine.inOut",
    x: -(projectsCards.clientWidth - window.innerWidth)
})

function updateProjectsCards() {
    projectsCardsEnd.style.marginTop = (projectsCards.clientWidth / 2) + "px";
}

updateProjectsCards();

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

window.addEventListener("resize", updateProjectsCards);