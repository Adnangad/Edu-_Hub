import axios from "axios";
const taskUrl = 
const token = '72be6125-cbc0-4a7c-8b44-d3872b9e7033';
axios
  .get(taskUrl, {
    headers: { "Content-Type": "Application/json", "X-Token": token },
    body: JSON.stringify({ modelType: model, course: element.name }),
  })
  .then(function (response) {
    if (response.status == 200) {
      const data = response;
      console.log(data);
    }
  });
