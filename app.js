const titleText      = "Photo and Video Editor Portfolio";
const paraText       = "I am an experienced media professional and passionate storyteller, always on the lookout for something creative.";
const passionText    = "Growing up, I watched behind-the-scenes videos of all my favorite movies. This just fueled my passion for professional storytelling. Editing isn't just my profession, it's my passion. I enjoy crafting compelling narratives. I wrote and produced several videos, photographed large events, edited podcast audio, managed social media, and wrote blog posts.";
const producerText   = "I excel at crafting compelling video, photo, and audio content that have real world impact. From promotional series screened in the UK to data-driven presentations that shaped real city policy. Have a story that needs telling? Let's talk.";
const strategistText = "I design standout social media content and brand identities — from marketing materials to websites, I've helped nonprofits, small businesses, and local governments grow their presence. Have a brand that needs a boost? Reach out.";

function typeWriter(elementId, text, speed, onDone) {
    const el = document.getElementById(elementId);
    let i = 0;
    el.classList.add('typing-active');
    function typeNextLetter() {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
            setTimeout(typeNextLetter, speed);
        } else {
            el.classList.remove('typing-active');
            if (onDone) onDone();
        }
    }
    typeNextLetter();
}

typeWriter('typewriter-title', titleText, 60, function() {
    typeWriter('typewriter-p', paraText, 35, function() {
        typeWriter('typewriter-passion', passionText, 25);
    });
});

const hoverSign = document.querySelector('.hover-sign');

const videoList = document.querySelectorAll('.project-vidbox video');

videoList.forEach(function (video) {
    video.addEventListener("mouseenter", function () {
        video.play()
        hoverSign.classList.add("active")
    })
    video.addEventListener("mouseleave", function () {
        video.pause();
        hoverSign.classList.remove("active")
    })
})

const skillsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            typeWriter('typewriter-producer', producerText, 25, function() {
                typeWriter('typewriter-strategist', strategistText, 25);
            });
            skillsObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

skillsObserver.observe(document.querySelector('.skills-section'));

const jobSections = document.querySelectorAll('.job-details');

jobSections.forEach(function(details) {

    const ul = details.querySelector('.job-bullets');

    const items = ul.querySelectorAll('li');

    items.forEach(function(li, i) {

        const delay = i * 0.15;

        li.style.setProperty('--delay', delay + 's');

    });

    details.addEventListener('toggle', function() {

        if (details.open) {
            ul.classList.add('is-open');
        } else {
            ul.classList.remove('is-open');
        }

    });

});
// Load the YouTube API script dynamically
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// YouTube calls this function automatically when its API is ready
function onYouTubeIframeAPIReady() {
    document.querySelectorAll('.project-vidbox iframe').forEach(function(iframe, i) {
        
        // Ensure URL has enablejsapi=1
        var url = new URL(iframe.src);
        url.searchParams.set('enablejsapi', '1');
        iframe.src = url.toString();

        // Give each iframe a unique id
        iframe.id = 'yt-player-' + i;

        // Wrap hover listeners inside the onReady event
        var player = new YT.Player(iframe.id, {
            events: {
                'onReady': function(event) {
                    var box = iframe.closest('.project-vidbox');

                    box.addEventListener('mouseenter', function() {
                        event.target.playVideo();
                    });

                    box.addEventListener('mouseleave', function() {
                        event.target.pauseVideo();
                    });
                }
            }
        });
    });
}

