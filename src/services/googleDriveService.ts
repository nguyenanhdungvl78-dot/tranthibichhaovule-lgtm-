import { getAccessToken } from './firebaseAuth';
import { Worksheet } from '../types/worksheet';

export interface DriveWorksheetFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  description?: string;
}

/**
 * List all math worksheet files created by the application on Google Drive
 */
export async function listWorksheetsFromDrive(): Promise<DriveWorksheetFile[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const query = encodeURIComponent("trashed = false and name contains 'math_worksheet_7991_'");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,createdTime,modifiedTime,description)&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || `Lỗi tải danh sách tệp Google Drive (${response.status})`);
  }

  const data = await response.json();
  return (data.files || []) as DriveWorksheetFile[];
}

/**
 * Save a new worksheet to Google Drive
 */
export async function saveWorksheetToDrive(worksheet: Worksheet): Promise<DriveWorksheetFile> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google. Vui lòng đăng nhập để lưu lên Google Drive.');
  }

  const fileName = `math_worksheet_7991_${worksheet.metadata.grade}_${worksheet.metadata.title.replace(/[\/\\:*?"<>|]/g, '_')}.json`;
  const fileDescription = `Phiếu bài tập Toán Lớp ${worksheet.metadata.grade} - CV 7991: ${worksheet.metadata.title}`;

  const metadata = {
    name: fileName,
    description: fileDescription,
    mimeType: 'application/json',
  };

  const fileContent = JSON.stringify(worksheet, null, 2);

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Lưu phiếu lên Google Drive thất bại (${response.status})`);
  }

  return (await response.json()) as DriveWorksheetFile;
}

/**
 * Update an existing worksheet file on Google Drive
 */
export async function updateWorksheetOnDrive(fileId: string, worksheet: Worksheet): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google.');
  }

  const fileContent = JSON.stringify(worksheet, null, 2);

  const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: fileContent,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Cập nhật tệp trên Google Drive thất bại (${response.status})`);
  }
}

/**
 * Load worksheet content from Google Drive
 */
export async function loadWorksheetFromDrive(fileId: string): Promise<Worksheet> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Không thể tải nội dung phiếu từ Google Drive (${response.status})`);
  }

  const json = await response.json();
  return json as Worksheet;
}

/**
 * Delete a worksheet file from Google Drive
 * (NOTE: Caller must present confirmation dialog before invoking this)
 */
export async function deleteWorksheetFromDrive(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Xóa tệp trên Google Drive thất bại (${response.status})`);
  }
}
