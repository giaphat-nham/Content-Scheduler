const overlay = document.querySelector(".overlay");
const modals = document.querySelectorAll(".modal");
const btnAddMonth = document.querySelector(".add-month");
const btnAddContent = document.querySelector(".add-content");
const btnUpdateContent = document.querySelector(".configure-content");
const btnCloseAddMonth = document.querySelector(".cancel-month-form-button");
const btnCloseAddContent = document.querySelector(
  ".cancel-content-form-button"
);
const btnCloseAddPost = document.querySelector(".cancel-post-form-button");
const btnCloseUpdateContent = document.querySelector(
  ".cancel-update-content-form-button"
);
const btnAddMonthForm = document.querySelector(".add-month-form-button");
const btnAddContentForm = document.querySelector(".add-content-form-button");
const btnUpdateContentForm = document.querySelector(
  ".update-content-form-button"
);
const btnAddPostForm = document.querySelector(".add-post-form-button");
const monthsContainer = document.querySelector(".month-list-ul");
const scheduleContent = document.querySelector("[data-schedule-content]");

const LOCAL_STORAGE_MONTH_KEY = "HIM.month.list";
const LOCAL_STORAGE_SELECTED_MONTH_ID_KEY = "HIM.month.selectedMonthID";

let months = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MONTH_KEY)) || [];
let selectedMonthID = localStorage.getItem(LOCAL_STORAGE_SELECTED_MONTH_ID_KEY);
let selectedContentID = null;
let selectedPostID = null;

console.log(months);

scheduleContent.style.display = "none";
overlay.style.display = "none";
modals.forEach((modal) => {
  modal.style.display = "none";
});
btnAddMonth.addEventListener("click", (e) => openModal(".add-month-form"));
btnAddContent.addEventListener("click", (e) => openModal(".add-content-form"));

btnCloseAddMonth.addEventListener("click", (e) => hideOverlay());
btnCloseAddContent.addEventListener("click", (e) => hideOverlay());
btnCloseAddPost.addEventListener("click", (e) => hideOverlay());
btnCloseUpdateContent.addEventListener("click", (e) => hideOverlay());
btnAddMonthForm.addEventListener("click", (e) => addMonth());
btnAddContentForm.addEventListener("click", (e) => addContent());
btnAddPostForm.addEventListener("click", (e) => addPost());
btnUpdateContentForm.addEventListener("click", (e) => updateContent());

monthsContainer.addEventListener("click", (e) => {
  if (
    e.target.tagName.toLowerCase() === "li" ||
    e.target.tagName.toLowerCase() === "span"
  ) {
    selectedMonthID = e.target.dataset.monthId;
    save();
    renderContent();
  }

  if (e.target.tagName.toLowerCase() === "button") {
    selectedMonthID = e.target.dataset.monthId;
    if (confirm("Bạn chắc chắn muốn xóa lịch này?")) {
      months = months.filter((month) => month.id !== selectedMonthID);
      selectedMonthID = null;
      scheduleContent.style.display = "none";
      saveAndRender();
    }
  }
});

function openModal(modalClass) {
  let openModal = document.querySelector(modalClass);
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
  openModal.style.display = "";
  overlay.style.display = "";
}

function hideOverlay() {
  overlay.style.display = "none";
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function render() {
  clearElement(monthsContainer);
  //render month list
  months.forEach((month) => {
    const newMonth = document.createElement("li");
    newMonth.dataset.monthId = month.id;
    newMonth.innerHTML = `<span data-month-id='${month.id}'>${month.name}</span>
              <button class="delete-schedule" data-month-id='${month.id}'>&times;</button>`;
    monthsContainer.appendChild(newMonth);
  });
}

function renderContent() {
  //render contents
  const contentTitle = document.querySelector(".schedule-title-text");
  const selectedMonth =
    months.find((month) => month.id === selectedMonthID) || months[0];
  if (selectedMonthID === null) selectedMonthID = selectedMonth.id;
  contentTitle.innerHTML =
    selectedMonth.name +
    " - tháng " +
    selectedMonth.month +
    "/" +
    selectedMonth.year;
  scheduleContent.style.display = "";

  const scheduleContentSub = document.querySelector(".schedule-content");
  clearElement(scheduleContentSub);

  selectedMonth.contents.forEach((content) => {
    const newContent = document.createElement("div");
    newContent.classList.add("post-content");
    newContent.dataset.contentId = content.id;
    newContent.innerHTML = `
                <div class="content-info">
                  <div class="info">
                    <div class="content-name">${content.name}</div>
                    <div class="progess" data-content-id='${content.id}'>Tiến độ: ${content.posted}/${content.posts.length}</div>
                    <div class="color-code" data-content-id='${content.id}'></div>
                  </div>

                  <div class="content-buttons">
                    <div class="configure-content button" data-content-id='${content.id}'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Filled"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M1.172,19.119A4,4,0,0,0,0,21.947V24H2.053a4,4,0,0,0,2.828-1.172L18.224,9.485,14.515,5.776Z"
                        />
                        <path
                          d="M23.145.855a2.622,2.622,0,0,0-3.71,0L15.929,4.362l3.709,3.709,3.507-3.506A2.622,2.622,0,0,0,23.145.855Z"
                        />
                      </svg>
                    </div>
                    <div class="add-post button" data-content-id='${content.id}'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style="enable-background: new 0 0 512 512"
                        xml:space="preserve"
                        width="24"
                        height="24"
                      >
                        <g>
                          <path
                            d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z"
                          />
                        </g>
                      </svg>
                    </div>
                    <div class="delete-content button" data-content-id='${content.id}'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"
                        />
                        <path
                          d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"
                        />
                        <path
                          d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"
                        />
                      </svg>
                    </div>
                    <div class="expand-content button" data-content-id='${content.id}'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Isolation_Mode"
                        data-name="Isolation Mode"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M16.041,24,6.534,14.48a3.507,3.507,0,0,1,0-4.948L16.052,0,18.17,2.121,8.652,11.652a.5.5,0,0,0,0,.707l9.506,9.52Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="posts" data-content-id='${content.id}'>
                  
                </div>
`;
    scheduleContentSub.appendChild(newContent);
    const colorCode = document.querySelector(
      `[data-content-id='${content.id}'].color-code`
    );
    colorCode.style.backgroundColor = content.color;

    const buttonAddPost = document.querySelector(
      `[data-content-id='${content.id}'].add-post.button`
    );
    const btnExpandContent = document.querySelector(
      `[data-content-id='${content.id}'].expand-content.button`
    );
    const btnConfigureContent = document.querySelector(
      `[data-content-id='${content.id}'].configure-content.button`
    );
    const dateSelect = document.querySelector("[name='post-date']");

    const posts = document.querySelector(
      `[data-content-id='${content.id}'].posts`
    );

    btnConfigureContent.addEventListener("click", (e) =>
      openModal(".update-content-form")
    );
    btnConfigureContent.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "svg") {
        selectedContentID = e.target.parentElement.dataset.contentId;
      } else if (e.target.tagName.toLowerCase() === "path") {
        selectedContentID =
          e.target.parentElement.parentElement.dataset.contentId;
      }

      const updateName = document.querySelector("[name='update-content-name']");
      const updateColor = document.querySelector(
        "[name='update-content-color']"
      );

      updateName.value = selectedMonth.contents.find(
        (content) => (content.id = selectedContentID)
      ).name;
      updateColor.value = selectedMonth.contents.find(
        (content) => (content.id = selectedContentID)
      ).color;
    });

    const btnDeleteContent = document.querySelector(`[data-content-id='${content.id}'].delete-content.button`);
    btnDeleteContent.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "svg") {
        selectedContentID = e.target.parentElement.dataset.contentId;
      } else if (e.target.tagName.toLowerCase() === "path") {
        selectedContentID =
          e.target.parentElement.parentElement.dataset.contentId;
      }

      if (confirm("Bạn chắc chắn muốn xóa content này?")) {
        selectedMonth.contents = selectedMonth.contents.filter(
          (content) => content.id !== selectedContentID
        );
        save();
        renderContent();
      }
    });
    posts.style.display = "none";

    clearElement(dateSelect);
    if (
      selectedMonth.month == "1" ||
      selectedMonth.month == "3" ||
      selectedMonth.month == "5" ||
      selectedMonth.month == "7" ||
      selectedMonth.month == "8" ||
      selectedMonth.month == "10" ||
      selectedMonth.month == "12"
    ) {
      for (let i = 1; i <= 31; i++) {
        const option = document.createElement("option");
        option.innerHTML = `<option value='${i}'>${i}</option>`;
        dateSelect.appendChild(option);
      }
    } else if (selectedMonth.month == "2") {
      for (let i = 1; i <= 29; i++) {
        const option = document.createElement("option");
        option.innerHTML = `<option value='${i}'>${i}</option>`;
        dateSelect.appendChild(option);
      }
    } else {
      for (let i = 1; i <= 30; i++) {
        const option = document.createElement("option");
        option.innerHTML = `<option value='${i}'>${i}</option>`;
        dateSelect.appendChild(option);
      }
    }
    buttonAddPost.addEventListener("click", (e) => openModal(".add-post-form"));
    buttonAddPost.addEventListener("click", (e) => {
      console.log(e.target);
      if (e.target.tagName.toLowerCase() === "svg") {
        selectedContentID = e.target.parentElement.dataset.contentId;
      } else if (e.target.tagName.toLowerCase() === "path") {
        selectedContentID =
          e.target.parentElement.parentElement.parentElement.dataset.contentId;
      }
      console.log(selectedContentID);
    });
    btnExpandContent.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "svg") {
        selectedContentID = e.target.parentElement.dataset.contentId;
        console.log(selectedContentID);
      } else if (e.target.tagName.toLowerCase() === "path") {
        selectedContentID =
          e.target.parentElement.parentElement.dataset.contentId;
        console.log(selectedContentID);
      } else if (e.target.tagName.toLowerCase() === "button") {
        selectedContentID = e.target.dataset.contentId;
        console.log(selectedContentID);
      }
      const postsContainer = document.querySelector(
        `[data-content-id='${selectedContentID}'].posts`
      );
      renderPost();
      console.log(postsContainer.style.display);
      if (postsContainer.style.display != "none") {
        postsContainer.style.display = "none";
        console.log("EXECUTED DISPLAY = NONE");
      } else {
        postsContainer.style.display = "flex";
        console.log("EXECUTED DISPLAY = FLEX");
        console.log(postsContainer.style.display);
      }
    });
  });

  //render calender
  const calenderDates = document.querySelector(".dates");
  const monthNum = selectedMonth.month;
  let monthText = "";

  clearElement(calenderDates);
  switch (monthNum) {
    case "1":
      monthText = "January";
      break;
    case "2":
      monthText = "February";
      break;
    case "3":
      monthText = "March";
      break;
    case "4":
      monthText = "April";
      break;
    case "5":
      monthText = "May";
      break;
    case "6":
      monthText = "June";
      break;
    case "7":
      monthText = "July";
      break;
    case "8":
      monthText = "August";
      break;
    case "9":
      monthText = "September";
      break;
    case "10":
      monthText = "October";
      break;
    case "11":
      monthText = "November";
      break;
    case "12":
      monthText = "December";
      break;
  }
  const date = new Date(`${monthText} 1, ${selectedMonth.year} 00:00:00`);
  const weekDay = date.getDay();
  let empties = 0;

  for (let i = 0; i < weekDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("date");
    calenderDates.appendChild(emptyCell);
    empties++;
  }
  if (
    selectedMonth.month == "1" ||
    selectedMonth.month == "3" ||
    selectedMonth.month == "5" ||
    selectedMonth.month == "7" ||
    selectedMonth.month == "8" ||
    selectedMonth.month == "10" ||
    selectedMonth.month == "12"
  ) {
    for (let i = 1; i <= 31; i++) {
      const cell = document.createElement("div");
      cell.classList.add("date");
      cell.innerHTML = i;
      cell.dataset.date = i;
      calenderDates.appendChild(cell);
    }
  } else if (selectedMonth.month == "2") {
    for (let i = 1; i <= 29; i++) {
      const cell = document.createElement("div");
      cell.classList.add("date");
      cell.innerHTML = i;
      cell.dataset.date = i;
      calenderDates.appendChild(cell);
    }
  } else {
    for (let i = 1; i <= 30; i++) {
      const cell = document.createElement("div");
      cell.classList.add("date");
      cell.innerHTML = i;
      cell.dataset.date = i;
      calenderDates.appendChild(cell);
    }
  }

  selectedMonth.contents.forEach((content) => {
    content.posts.forEach((post) => {
      const calenderCell = document.querySelector(
        `.dates :nth-child(${parseInt(empties) + parseInt(post.date)})`
      );
      calenderCell.style.color = "white";
      calenderCell.style.backgroundColor = content.color;
    });
  });

  // render today content
  const todayContentContainer = document.querySelector(".today-content");
  clearElement(todayContentContainer);
  const d = new Date();
  today = d.getDate();

  selectedMonth.contents.forEach((content) => {
    content.posts.forEach((post) => {
      if (post.date == today) {
        const todayContent = document.createElement("li");
        todayContent.innerHTML = content.name;
        todayContentContainer.appendChild(todayContent);
      }
    });
  });
}

function renderPost() {
  const selectedMonth = months.find((month) => month.id === selectedMonthID);
  const selectedContent = selectedMonth.contents.find(
    (content) => content.id === selectedContentID
  );
  const postsContainer = document.querySelector(
    `[data-content-id='${selectedContentID}'].posts`
  );
  clearElement(postsContainer);
  const postInfos = document.createElement("div");
  postInfos.classList.add("post-infos");
  postInfos.innerHTML = `
                    <div class="post-info">Ngày đăng</div>
                    <div class="post-info">Hoàn thành</div>
                    <div class="post-info">Xoá</div>
                  `;
  postsContainer.appendChild(postInfos);
  selectedContent.posts.forEach((post) => {
    const newPost = document.createElement("div");
    newPost.classList.add("post");
    newPost.innerHTML = `<div class="post-date">${post.date}</div>
                    <input
                      type="checkbox"
                      name="post-status"
                      class="post-status"
                      data-post-id='${post.id}'
                    />
                    <button class="delete-post" data-post-id='${post.id}'>&times;</button>`;
    postsContainer.appendChild(newPost);
    const btnDeletePost = document.querySelector(
      `[data-post-id='${post.id}'].delete-post`
    );

    btnDeletePost.addEventListener("click", (e) => {
      selectedPostID = e.target.dataset.postId;
      console.log(selectedPostID);
      if (confirm("Bạn chắc chắn muốn xóa post này?")) {
        selectedContent.posts = selectedContent.posts.filter(
          (post) => post.id !== selectedPostID
        );
        selectedContent.posted--;
        save();
        renderPost();
        renderContent();
      }
    });

    const checkbox = document.querySelector(
      `[data-post-id='${post.id}'].post-status`
    );
    checkbox.checked = post.checked;
    checkbox.addEventListener("change", (e) => {
      selectedContentID =
        e.target.parentElement.parentElement.dataset.contentId;
      const selectedContent = selectedMonth.contents.find(
        (content) => content.id === selectedContentID
      );
      selectedPostID = e.target.dataset.postId;
      const selectedPost = selectedContent.posts.find(
        (post) => post.id === selectedPostID
      );
      if (checkbox.checked) {
        selectedContent.posted++;
        selectedPost.checked = true;
        save();
      } else {
        selectedContent.posted--;
        selectedPost.checked = false;
        save();
      }
      const progress = document.querySelector(
        `[data-content-id='${selectedContentID}'].progess`
      );
      progress.innerHTML = `Tiến độ: ${selectedContent.posted}/${selectedContent.posts.length}`;
    });
  });
}

function createMonth(name, month, year) {
  return {
    id: Date.now().toString(),
    name: name,
    month: month,
    year: year,
    contents: [],
  };
}

function createContent(name, color) {
  return {
    id: Date.now().toString(),
    name: name,
    color: color,
    posted: 0,
    posts: [],
  };
}

function createPost(date) {
  return {
    id: Date.now().toString(),
    date: date,
    checked: false,
  };
}

function addMonth() {
  let name = document.querySelector("[name='month-name']");
  let month = document.querySelector("[name='month']");
  let year = document.querySelector("[name='year']");

  if (name.value === "" || month.value === "" || year.value === "") return;

  const newMonth = createMonth(name.value, month.value, year.value);
  months.push(newMonth);
  saveAndRender();
  renderContent();
  hideOverlay();
  name.value = "";
  year.value = "";
}

function addContent() {
  if ((selectedContentID = null)) return;
  let name = document.querySelector("[name='content-name']");
  let color = document.querySelector("[name='content-color']");

  if (name.value === "" || color.value === "") return;

  const newContent = createContent(name.value, color.value);
  const selectedMonth =
    months.find((month) => month.id === selectedMonthID) || months[0];

  selectedMonth.contents.push(newContent);
  save();
  renderContent();
  hideOverlay();
  name.value = "";
}

function updateContent() {
  const updateName = document.querySelector("[name='update-content-name']");
  const updateColor = document.querySelector("[name='update-content-color']");

  const selectedMonth = months.find((month) => month.id === selectedMonthID);
  const selectedContent = selectedMonth.contents.find(
    (content) => (content.id = selectedContentID)
  );

  selectedContent.name = updateName.value;
  selectedContent.color = updateColor.value;
  save();
  renderContent();
  hideOverlay();
  updateName.value = "";
  updateColor.value = "";
}

function addPost() {
  const date = document.querySelector("[name='post-date']").value;

  const newPost = createPost(date);
  const selectedMonth = months.find((month) => month.id === selectedMonthID);
  const selectedContent = selectedMonth.contents.find(
    (content) => content.id === selectedContentID
  );
  console.log(selectedContentID);
  selectedContent.posts.push(newPost);
  save();
  renderPost();
  renderContent();
  hideOverlay();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_MONTH_KEY, JSON.stringify(months));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_MONTH_ID_KEY, selectedMonthID);
}

function saveAndRender() {
  save();
  render();
}

render();
