using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

public class FirebaseService
{
    private readonly string _bucketName;
    private static bool _isFirebaseInitialized;

    public FirebaseService(string bucketName)
    {
        _bucketName = bucketName;
        InitializeFirebase();
    }

    private void InitializeFirebase()
    {
        if (!_isFirebaseInitialized)
        {
            var keyPath = Path.Combine(Directory.GetCurrentDirectory(), "Helper", "firebase-key.json");

            
            if (!File.Exists(keyPath))
            {
                throw new FileNotFoundException("Firebase service account key file not found.", keyPath);
            }

            var options = new AppOptions
            {
                Credential = GoogleCredential.FromFile(keyPath)
            };

            // Check if FirebaseApp has already been initialized
            if (FirebaseApp.DefaultInstance == null && !_isFirebaseInitialized)
            {
                FirebaseApp.Create(options);
            }

            _isFirebaseInitialized = true;
        }
    }

    //public async Task<string> UploadFileAsync(IFormFile file)
    //{
    //    var storageClient = StorageClient.Create();
    //    var objectName = Path.GetFileName(file.FileName);

    //    using (var fileStream = file.OpenReadStream())
    //    {
    //        var storageObject = await storageClient.UploadObjectAsync(
    //            _bucketName,
    //            objectName,
    //            file.ContentType,
    //            fileStream
    //        );

    //        // Return the public URL or the object path
    //        return storageObject.MediaLink; // Ensure your bucket allows public access or adjust for your needs
    //    }
    //}

    public async Task<string> UploadFileAsync(IFormFile file,string name)
    {
        var storageClient = StorageClient.Create();
        var objectName = name;

        using (var fileStream = file.OpenReadStream())
        {
            var storageObject = await storageClient.UploadObjectAsync(
                _bucketName,
                objectName,
                file.ContentType,
                fileStream
            );

            // Construct the public URL manually
            var fileUrl = $"https://firebasestorage.googleapis.com/v0/b/{_bucketName}/o/{objectName}?alt=media";

            return fileUrl; // Return the public URL
        }
    }
}
