import data from "./data.json" assert { type: "json" };
console.log(data);

document.getElementById("collect-data").addEventListener("click", collateData);

function collateData() {
  let username = document.getElementById("ig-username").value;
  let posts = document.getElementById("number-of-posts").value;
  let followers = document.getElementById("number-of-followers").value;
  let following = document.getElementById("number-following").value;

  let bio = document.getElementById("bio").value;
  let www = document.getElementById("www").checked;
  let cta = document.getElementById("cta").checked;
  let badHashtags = document.getElementById("bad-hashtags").checked;
  let bulletPoints = document.getElementById("bullet-points").checked;
  let keywords = document.getElementById("keywords").checked;

  let notes = document.getElementById("notes").value;
  let pinnedPosts = document.getElementById("pinned-posts").checked;
  let highlights = document.getElementById("highlights").checked;

  let p1Likes = document.getElementById("post-one-likes").value;
  let p1Comments = document.getElementById("post-one-comments").value;
  let p1AverageER =
    ((parseInt(p1Comments) + parseInt(p1Likes)) / followers) * 100;

  let p2Likes = document.getElementById("post-two-likes").value;
  let p2Comments = document.getElementById("post-two-comments").value;
  let p2AverageER =
    ((parseInt(p2Comments) + parseInt(p2Likes)) / followers) * 100;

  let p3Likes = document.getElementById("post-three-likes").value;
  let p3Comments = document.getElementById("post-three-comments").value;
  let p3AverageER =
    ((parseInt(p3Comments) + parseInt(p3Likes)) / followers) * 100;

  let pAverageER =
    (((parseInt(p1Comments) +
      parseInt(p1Likes) +
      parseInt(p2Comments) +
      parseInt(p2Likes) +
      parseInt(p3Comments) +
      parseInt(p3Likes)) /
      followers) *
      100) /
    3;

  let r1Likes = document.getElementById("reel-one-likes").value;
  let r1Comments = document.getElementById("reel-one-comments").value;
  let r1Views = document.getElementById("reel-one-views").value;

  let r2Likes = document.getElementById("reel-two-likes").value;
  let r2Comments = document.getElementById("reel-two-comments").value;
  let r2Views = document.getElementById("reel-two-views").value;

  let r3Likes = document.getElementById("reel-three-likes").value;
  let r3Comments = document.getElementById("reel-three-comments").value;
  let r3Views = document.getElementById("reel-three-views").value;

  let rAverageER =
    (((parseInt(r1Comments) +
      parseInt(r1Likes) +
      parseInt(r1Views) +
      parseInt(r2Comments) +
      parseInt(r2Likes) +
      parseInt(r2Views) +
      parseInt(r3Comments) +
      parseInt(r3Likes) +
      parseInt(r3Views)) /
      followers) *
      100) /
    4;

  document.getElementById("handle").innerText = username;
  document.getElementById("client").innerText =
    "Completed for: " + username + ", by Digital Raquel";
  document.getElementById("posts").innerText = posts;
  document.getElementById("followers").innerText = followers;
  document.getElementById("following").innerText = following;
  document.getElementById("bio-description").innerText = bio

  let obs = document.getElementById("observations");
  obs.innerHTML = "";

  function presentBio() {
    let observationsHeading = document.createElement("h5");
    observationsHeading.innerHTML = "Bio Observations";
    obs.append(observationsHeading);
    let dividerDiv = document.createElement("div");
    dividerDiv.setAttribute("class", "divider");
    obs.append(dividerDiv);

    function checkBioSummary() {
      let bioSummary = "Great work, the length of your bio is spot on!";
      if (bio.length >= 165) {
        bioSummary =
          "Your bio is a tad too long, consider shortening it to around 150 characters.";
      }
      if (bio.length <= 135) {
        bioSummary =
          "Your bio is a little too short, consider writing a bit more, around 150 characters would be the sweet spot.";
      }
      let bioDiv = document.createElement("p");
      bioDiv.innerHTML = bioSummary;
      obs.append(bioDiv);
    }
    checkBioSummary();

    function checkBioTip() {
      let bioTip =
        "I can see that you have clearly stated who you are, what you do and for whom! Awesome.";

      if (www == false) {
        bioTip =
          "I'd like to see you state who you are, what you do and for whom!";
      }
      let bioTipDiv = document.createElement("p");
      bioTipDiv.innerHTML = bioTip;
      obs.append(bioTipDiv);
    }
    checkBioTip();

    function checkCTA() {
      let ctaTip = "Good call to action here! Love it.";

      if (cta == false) {
        ctaTip =
          "Use a CTA and updated link to your website, other accounts, a scheduler etc.";
      }
      let ctaTipDiv = document.createElement("p");
      ctaTipDiv.innerHTML = ctaTip;
      obs.append(ctaTipDiv);
    }
    checkCTA();
    function checkHashtags() {
      let hashtagTip = "Bad hastags! Remove immediately ";

      if (badHashtags == false) {
        hashtagTip = "";
      }
      let hashtagTipDiv = document.createElement("p");
      hashtagTipDiv.innerHTML = hashtagTip;
      obs.append(hashtagTipDiv);
    }
    checkHashtags();

    function checkBullets() {
      let bulletPointsTip = "Love the bullet points, clear and concise! ";

      if (bulletPoints == false) {
        bulletPointsTip =
          "Bullet points, I need to see more bullet points! It's a great way to draw attention to important info.";
      }
      let bulletPointsTipDiv = document.createElement("p");
      bulletPointsTipDiv.innerHTML = bulletPointsTip;
      obs.append(bulletPointsTipDiv);
    }
    checkBullets();

    function checkKeywords() {
      let keywordsTip = "Nice to see some suitable keywords here! You're a pro";

      if (keywords == false) {
        keywordsTip =
          "Yooooooo - Where the keywords at? Your name is 'searchable', you should therefore use keywords. Instead of having your actual name, put your title. For example 'Meditation Teacher for Adults and Families'";
      }
      let keywordsTipDiv = document.createElement("p");
      keywordsTipDiv.innerHTML = keywordsTip;
      obs.append(keywordsTipDiv);
    }
    checkKeywords();
  }
  presentBio();

  function presentAdditional() {
    let additionalsHeading = document.createElement("h5");
    additionalsHeading.innerHTML = "Additional Notes";
    obs.append(additionalsHeading);
    let dividerDiv = document.createElement("div");
    dividerDiv.setAttribute("class", "divider");
    obs.append(dividerDiv);

    function checkNotes() {
      let notesTipDiv = document.createElement("p");
      notesTipDiv.innerHTML = notes;
      obs.append(notesTipDiv);
    }
    checkNotes();

    function checkPinnedTips() {
      let pinnedTip = "Good use of pinned posts - Keep that up";

      if (pinnedPosts == false) {
        pinnedTip =
          "Why aren't you pinning your best work for everyone to see?? Keep a collection of your best posts here so you can show off your previous posts";
      }
      let pinnedTipDiv = document.createElement("p");
      pinnedTipDiv.innerHTML = pinnedTip;
      obs.append(pinnedTipDiv);
    }
    checkPinnedTips();

    function checkHighlights() {
      let highlightsTip =
        "Great job on showing off your highlights - you're a pro!";

      if (highlights == false) {
        highlightsTip =
          "You should really keep some highlights on your profile so your followers can interact with posts that they may have missed";
      }
      let highlightsTipDiv = document.createElement("p");
      highlightsTipDiv.innerHTML = highlightsTip;
      obs.append(highlightsTipDiv);
    }
    checkHighlights();
  }
  presentAdditional();

  function presentEngagement() {
    let eRRHeading = document.createElement("h5");
    eRRHeading.innerHTML = "Engagement rate by reach";
    obs.append(eRRHeading);
    let dividerDiv = document.createElement("div");
    dividerDiv.setAttribute("class", "divider");
    obs.append(dividerDiv);

    console.log(pAverageER);
    console.log(p1AverageER);
    console.log(p2AverageER);
    console.log(p3AverageER);
    //console.log(rAverageER)
    let avgTotalNumberDiv = document.createElement("div");
    avgTotalNumberDiv.setAttribute('class', 'avgER' )
    avgTotalNumberDiv.innerHTML =pAverageER.toFixed(2) + "% Engagement Rate by Reach"
    obs.append(avgTotalNumberDiv);


    let avgTotalTip =
      "Most social media marketing experts agree that a good engagement rate is between 1% to 5% — but the more followers you have, the harder it is to achieve. So, you're doing well. Keep it up!";

    if (pAverageER <= 1) {
      avgTotalTip =
        "We need to get to work on this! Between 1% to 5% is a solid ERR to aim for. Stay consitent, reply to EVERY single comment you receive";
    }
    let avgTotalTipDiv = document.createElement("p");
    avgTotalTipDiv.innerHTML =
      "Your average ERR for your three most recent posts is: " +
      pAverageER.toFixed(2) +
      ". " +
      avgTotalTip;
    obs.append(avgTotalTipDiv);
  }
  presentEngagement();
 alert("Give me 2 secs while I generate the audit. It should download automatically")
  setTimeout(download, 2000);
}

function download() {
 
const report = this.document.getElementById("report");
  console.log(window);
  var opt = {
    margin: [0, 0],
    filename: "5 step IG Audit by Digital Raquel",
    image: { type: "png", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
  };
  html2pdf().from(report).set(opt).save();
}
