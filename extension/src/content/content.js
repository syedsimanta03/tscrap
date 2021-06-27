import "core-js/stable";
import "regenerator-runtime/runtime";

const createChannelCard = (channel) => {
  const Card = document.createElement("div");
  Card.classList.add("channel-card");
  Card.setAttribute('id', channel.channelId)
  Card.setAttribute("surface_", "backstage-surface-type-home");


  Card.innerHTML = `
  <div id="header">
  <div id=channel-title>
      <a href="${"/channel/" + channel.channelId}" id='profile-link' target="_blank">
          <div id=channel-profile>
              <img id="channel-profile" src="${channel.imgSrc}">
              <h3>
                  ${channel.title}
              </h3>
          </div>
      </a>
  </div>
  <button id="show" class="voting" name="${channel.channelId}">
          📺
      </button>
  <div id="submission-time">
</div>
</div>


<p class="channel-desc">
  ${channel.desc}
</p>

<div id="channel-footer">
  <div id="voting">
      <div>
          <button id="upvote" class="voting" name=${
            channel.channelId
          }>👏</button>
          <span style="font-size:18px" id="upvotesCount-${channel.channelId}">${
channel.upvotesCount
}</span>
      </div>

      <a href="https://www.youtube.com/channel/${
        channel.channelId
      }?sub_confirmation=1">
      <button id="subscribe" class="voting" name=${
        channel.channelId
      }>🍿</button>
      </a>
  </div>
</div>
  `;

  return Card
}

const createChannelSection = async (videoSection) => {
  const res = await fetch(
    "https://us-central1-tube-hunt.cloudfunctions.net/app/api/channels"
  );
  const channels = await res.json();

  const channelSection = document.createElement("div");
  channelSection.setAttribute("id", "channel-section");
  channelSection.setAttribute("class",
    "section collapsible collapsed"
  );

  channels.sort((a, b) => {
    return b.upvotesCount - a.upvotesCount;
  });

  console.log(videoSection)
  if(videoSection) {
    console.log(videoSection)

  } else {
    channels.forEach((channel) => {
      channelSection.appendChild(createChannelCard(channel))
    });
  }

  return channelSection;
}

export default (async () => {

  //   <button id="downvote" name=${channel.channelId}>👎</button>
  // <div id="keywords">
  //       <span>${channel.keywords[0]}</span>
  //       <span>${channel.keywords[1]}</span>
  //       <span>${channel.keywords[2]}</span>
  //       <span>${channel.keywords[3]}</span>
  //       <span>${channel.keywords[4]}</span>
  //   </div>
  // <span>${new moment(channel.dateSubmitted).fromNow()}</span>


  //   Observe DOM mutation

  let showVideos = false;
  let channelCard = await createChannelSection(showVideos);
  let showingChannels = false
  let mainPage = document.querySelector("#contents");

  // Observer class to watch for DOM changes
  const mo = new MutationObserver(() => {
    if (!document.contains(channelCard)) {
      console.log("Changing");
      inject();

      if(showVideos) {
        console.log(showVideos)
        injectVideos(showVideos);
      }
    }
  });

  // observe changes
  const observe = () => {
    mo.observe(document.body, { childList: true, subtree: true });
  };


    // inject channel cards immediately invoked
  const inject = () => {
    mo.disconnect();

    // const huntSection = document.createElement('div');
    // huntSection.setAttribute('style', 'display:flex; flex-direction: column;')

    const toggle = document.createElement('button');
    toggle.setAttribute('id', 'toggle');

    if(showingChannels){
      toggle.innerHTML = 'Hunt 🎉'
    } else {
      toggle.innerHTML = 'Hunt🤞'
    }

    // huntSection.appendChild(toggle)
    // huntSection.appendChild(channelCard)

    mainPage.prepend(channelCard);
    mainPage.prepend(toggle)
    observe();
  }

  inject();

  // inject videos if videos exists
  const injectVideos = (videos) => {
    mo.disconnect();

    const channelId = videos.getAttribute('name')
    document.getElementById(channelId).insertAdjacentElement("afterend", videos);

    observe();
  }

  // create a video section html
  const createVideosSection = async (channelId) => {
    const videos = document.createElement("div");
    videos.setAttribute("id", `video-section`);
    videos.setAttribute("name", `${channelId}`);

    const res = await fetch(
      `https://us-central1-tube-hunt.cloudfunctions.net/app/api/videos/${channelId}`,
      {
        method: "get",
      }
    );

    const data = await res.json()

    if(res.status === 200) {
      console.log(data)
      data.videoIds.slice(0,8).forEach((videoId) => {
        videos.innerHTML += `
        <iframe width="250" height="170"
        src="https://www.youtube.com/embed/${videoId}">
        </iframe>s
      `;
        });
    }

    return videos;
  };

  // monitor all click events
  window.onclick = async (event) => {
    const target = event.target;
    if (target.matches("#upvote")) {
      const channelId = document.activeElement.getAttribute("name");

      // change the view
      let upvotesCount = document.getElementById(`upvotesCount-${channelId}`)
        .innerText;
      const upvotesElm = document.getElementById(`upvotesCount-${channelId}`);
      upvotesCount = parseInt(upvotesCount) + 1;
      upvotesElm.innerHTML = upvotesCount;

      // change model
      const res = await fetch(
        `https://us-central1-tube-hunt.cloudfunctions.net/app/api/${channelId}/upvote`,
        {
          method: "get",
        }
      );
      console.log("Upvoted!");
    }

    // show videos
    if (target.matches("#show")) {
      console.log("clicked!!!!");
      const channelId = document.activeElement.getAttribute("name");

      if (showVideos) {
        console.log("contains channel-section");
        if (
          document.getElementById("video-section").getAttribute("name") != channelId
        ) {
          document.getElementById("video-section").remove();
          const videos = await createVideosSection(channelId);
          showVideos = videos
          injectVideos(videos);
        } else {
          showVideos = false;
          document.getElementById("video-section").remove();
        }
        // if there is no showVideos
      } else {
        const videos = await createVideosSection(channelId);
        showVideos = videos
        injectVideos(videos);
      }
    }

    // toggle more channels
    if (target.matches("#toggle")) {
      if(showingChannels){
        document.querySelector('.section.collapsible').classList.toggle('collapsed');
        document.querySelector('#toggle').innerHTML = 'Hunt🤞'
        showingChannels = false;

      } else {
        document.querySelector('#toggle').innerHTML = 'Hunt 🎉'
        document.querySelector('.section.collapsible').classList.toggle('collapsed');
        showingChannels = true;
      }

    }
  };
})();

console.log("loaded the script!");
