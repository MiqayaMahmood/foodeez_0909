export class StrapiFileService {
  private static STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
  private static STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

  /**
   * Delete a file from Strapi by file ID
   */
  static async deleteFile(fileId: string): Promise<boolean> {
    if (!this.STRAPI_URL || !this.STRAPI_API_TOKEN) {
      console.error('Strapi configuration missing');
      return false;
    }

    try {
      const response = await fetch(`${this.STRAPI_URL}/api/upload/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.STRAPI_API_TOKEN}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting Strapi file:', error);
      return false;
    }
  }

  /**
   * Get files from a specific Strapi folder
   */
  static async getFilesFromFolder(folderId: string): Promise<any[]> {
    if (!this.STRAPI_URL || !this.STRAPI_API_TOKEN) {
      console.error('Strapi configuration missing');
      return [];
    }

    try {
      const response = await fetch(`${this.STRAPI_URL}/api/upload/files?folder=${folderId}`, {
        headers: {
          'Authorization': `Bearer ${this.STRAPI_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch files from Strapi');
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching files from Strapi:', error);
      return [];
    }
  }

  /**
   * Delete files that match a specific pattern (e.g., user email)
   */
  static async deleteFilesByPattern(pattern: string, folderId: string): Promise<void> {
    try {
      const files = await this.getFilesFromFolder(folderId);
      
      // Find files that match the pattern
      const matchingFiles = files.filter((file: any) => 
        file.name && file.name.includes(pattern)
      );

      // Delete each matching file
      for (const file of matchingFiles) {
        const deleted = await this.deleteFile(file.id);
        if (deleted) {
          console.log(`Deleted file: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error deleting files by pattern:', error);
    }
  }

  /**
   * Upload file to Strapi with folder specification
   */
  static async uploadFile(file: File | Blob, fileName: string, folderId: string): Promise<string | null> {
    if (!this.STRAPI_URL || !this.STRAPI_API_TOKEN) {
      console.error('Strapi configuration missing');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('files', file, fileName);
      formData.append('folder', folderId);

      const response = await fetch(`${this.STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.STRAPI_API_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Strapi upload failed:', await response.text());
        return null;
      }

      const data = await response.json();
      
      if (data && data[0] && data[0].url) {
        return data[0].url.startsWith('http') 
          ? data[0].url 
          : `${this.STRAPI_URL}${data[0].url}`;
      }

      return null;
    } catch (error) {
      console.error('Error uploading file to Strapi:', error);
      return null;
    }
  }

  /**
   * Upload profile image with automatic cleanup of previous images
   */
  static async uploadProfileImage(file: File, userEmail: string): Promise<string | null> {
    try {
      // Delete previous profile images first
      await this.deleteFilesByPattern(userEmail, '7');
      
      // Upload new image
      const imageUrl = await this.uploadFile(file, `${userEmail}.jpg`, '7');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  }

//   /**
//    * Upload review images with automatic cleanup
//    */
//   static async uploadReviewImages(files: File[], userEmail: string): Promise<string[]> {
//     try {
//       // Delete previous review images for this user
//       await this.deleteFilesByPattern(userEmail, '9');
      
//       // Upload new images
//       const uploadPromises = files.map((file, index) => 
//         this.uploadFile(file, `${userEmail}_review_${Date.now()}_${index}.jpg`, '9')
//       );
      
//       const results = await Promise.all(uploadPromises);
//       return results.filter((url): url is string => url !== null);
//     } catch (error) {
//       console.error('Error uploading review images:', error);
//       return [];
//     }
//   }

//   /**
//    * Upload food journey images with automatic cleanup
//    */
//   static async uploadFoodJourneyImages(files: File[], userEmail: string): Promise<string[]> {
//     try {
//       // Delete previous food journey images for this user
//       await this.deleteFilesByPattern(userEmail, '14');
      
//       // Upload new images
//       const uploadPromises = files.map((file, index) => 
//         this.uploadFile(file, `${userEmail}_journey_${Date.now()}_${index}.jpg`, '14')
//       );
      
//       const results = await Promise.all(uploadPromises);
//       return results.filter((url): url is string => url !== null);
//     } catch (error) {
//       console.error('Error uploading food journey images:', error);
//       return [];
//     }
//   }
} 