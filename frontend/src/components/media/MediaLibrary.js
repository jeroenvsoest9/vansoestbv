import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Modal,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  TableChart as SpreadsheetIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";
import axios from "axios";

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  useEffect(() => {
    filterAndSortFiles();
  }, [mediaFiles, searchQuery, sortBy]);

  const filterAndSortFiles = () => {
    let filtered = [...mediaFiles];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "date":
        default:
          return new Date(b.lastModified) - new Date(a.lastModified);
      }
    });

    setFilteredFiles(filtered);
  };

  const fetchMediaFiles = async () => {
    try {
      const response = await axios.get("/api/media");
      setMediaFiles(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        "Er is een fout opgetreden bij het ophalen van de media bestanden.",
      );
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadProgress(0);
      const response = await axios.post("/api/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });

      setMediaFiles([response.data.file, ...mediaFiles]);
      setUploadDialog(false);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err) {
      setError("Er is een fout opgetreden bij het uploaden van het bestand.");
      setUploadProgress(0);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm("Weet je zeker dat je dit bestand wilt verwijderen?"))
      return;

    try {
      await axios.delete(`/api/media/${filename}`);
      setMediaFiles(mediaFiles.filter((file) => file.name !== filename));
    } catch (err) {
      setError(
        "Er is een fout opgetreden bij het verwijderen van het bestand.",
      );
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case ".jpg":
      case ".jpeg":
      case ".png":
      case ".gif":
      case ".webp":
        return <ImageIcon />;
      case ".pdf":
        return <PdfIcon />;
      case ".doc":
      case ".docx":
        return <DocumentIcon />;
      case ".xls":
      case ".xlsx":
        return <SpreadsheetIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Media Bibliotheek</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          component="label"
        >
          Upload Bestand
          <input type="file" hidden onChange={handleFileSelect} />
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Zoek bestanden..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sorteer op</InputLabel>
          <Select
            value={sortBy}
            label="Sorteer op"
            onChange={(e) => setSortBy(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="date">Datum</MenuItem>
            <MenuItem value="name">Naam</MenuItem>
            <MenuItem value="size">Grootte</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredFiles.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.name}>
            <Card>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handlePreview(file)}
              >
                {getFileIcon(file.type)}
                <Tooltip title="Klik om te vergroten">
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
              </CardMedia>
              <CardContent>
                <Typography variant="subtitle2" noWrap>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFileSize(file.size)}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" p={1}>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(file.name)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)}>
        <DialogTitle>Bestand Uploaden</DialogTitle>
        <DialogContent>
          <Typography>{selectedFile?.name}</Typography>
          {uploadProgress > 0 && (
            <Box mt={2}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Annuleren</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploadProgress > 0}
          >
            Uploaden
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <Box
          sx={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 1,
          }}
        >
          {previewFile && (
            <>
              {previewFile.type.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                  }}
                >
                  {getFileIcon(previewFile.type)}
                  <Typography variant="h6" mt={2}>
                    {previewFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(previewFile.size)}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MediaLibrary;
