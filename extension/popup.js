document.getElementById('analyzeBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const status = document.getElementById('status');
  const resultSection = document.getElementById('resultSection');

  if (!file) {
    status.textContent = "Please select a file.";
    return;
  }

  if (file.size > 20 * 1024 * 1024) {  // 20MB limit
    status.textContent = "File size exceeds 20MB limit.";
    return;
  }

  status.textContent = "Uploading & analyzing...";
  resultSection.style.display = "none";

  const formData = new FormData();
  formData.append('file', file);

  fetch('http://localhost:8000/api/analyze', {
    method: 'POST',
    body: formData
  })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('summary').textContent = data.summary || 'No summary';
        document.getElementById('confidence').textContent = `${data.fairness_score || '0'}%`;

      document.getElementById('downloadBtn').href = `data:text/plain;charset=utf-8,${encodeURIComponent(data.summary)}`;
      resultSection.style.display = "block";
      status.textContent = "Analysis complete.";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "Error analyzing document.";
    });
});
