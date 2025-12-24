
//client/src/pages/faculty/PreviewReport.jsx


// import React, { useEffect, useState } from "react";
// import { Box, Button, Stack } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosClient from "../../utils/axiosClient";

// export default function PreviewReport() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [html, setHtml] = useState("");

//   useEffect(() => {
//     axiosClient
//       .get(`/activity/${id}/preview`, { responseType: "text" })
//       .then((res) => setHtml(res.data));
//   }, [id]);

//   return (
//     <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
//       {/* TOP ACTION BAR */}
//       <Stack direction="row" spacing={2} sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
//         <Button variant="contained" onClick={() => window.open(`/api/activity/${id}/pdf`)}>
//           Download PDF
//         </Button>

//         <Button variant="contained" onClick={() => window.open(`/api/activity/${id}/docx`)}>
//           Download DOCX
//         </Button>

//         <Button variant="outlined" onClick={() => navigate(`/faculty/edit/${id}`)}>
//           Edit Report
//         </Button>

//         <Button variant="text" onClick={() => navigate(-1)}>
//           Back
//         </Button>
//       </Stack>

//       {/* PREVIEW FRAME */}
//       <iframe
//         title="Preview"
//         style={{ flex: 1, border: "none" }}
//         srcDoc={html}
//       />
//     </Box>
//   );
// }




import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

export default function ReportPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const previewUrl = `http://localhost:5002/api/activity/${id}/preview`;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          gap: 1,
          borderBottom: "1px solid #ddd",
          background: "#fafafa"
        }}
      >
        <Button
          variant="contained"
          onClick={() =>
            window.open(
              `http://localhost:5002/api/activity/${id}/pdf`,
              "_blank"
            )
          }
        >
          Download PDF
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            window.open(
              `http://localhost:5002/api/activity/${id}/docx`,
              "_blank"
            )
          }
        >
          Download DOCX
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate(`/faculty/report/${id}/edit`)}
        >
          Edit Report
        </Button>

        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      {/* Preview iframe */}
      <iframe
        src={previewUrl}
        title="Report Preview"
        style={{
          flex: 1,
          border: "none",
          width: "100%"
        }}
      />
    </Box>
  );
}
