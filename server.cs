using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;

class TestEntryServer
{
    const int PORT = 3000;

    static void Main(string[] args)
    {
        string distPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dist");

        if (!Directory.Exists(distPath))
        {
            Console.WriteLine("Error: dist folder not found!");
            Console.WriteLine("Please make sure the dist folder is in the same directory as this exe.");
            Console.ReadKey();
            return;
        }

        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + PORT + "/");

        try
        {
            listener.Start();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to start server: " + ex.Message);
            Console.ReadKey();
            return;
        }

        Console.WriteLine("");
        Console.WriteLine("  ========================================");
        Console.WriteLine("    Test Entry Server Started");
        Console.WriteLine("  ========================================");
        Console.WriteLine("");
        Console.WriteLine("    Local:   http://localhost:" + PORT);
        Console.WriteLine("");
        Console.WriteLine("    Press Ctrl+C to stop");
        Console.WriteLine("");

        // Open browser
        Process.Start(new ProcessStartInfo
        {
            FileName = "http://localhost:" + PORT,
            UseShellExecute = true
        });

        // Handle Ctrl+C
        Console.CancelKeyPress += (sender, e) =>
        {
            e.Cancel = true;
            listener.Stop();
        };

        try
        {
            while (listener.IsListening)
            {
                HttpListenerContext context = listener.GetContext();
                HandleRequest(context, distPath);
            }
        }
        catch (HttpListenerException)
        {
            // Listener was stopped
        }
        finally
        {
            listener.Close();
        }
    }

    static void HandleRequest(HttpListenerContext context, string distPath)
    {
        try
        {
            string urlPath = context.Request.Url.LocalPath;
            if (urlPath == "/") urlPath = "/index.html";

            string filePath = Path.Combine(distPath, urlPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath) && !File.GetAttributes(filePath).HasFlag(FileAttributes.Directory))
            {
                string ext = Path.GetExtension(filePath).ToLower();
                string mime = GetMimeType(ext);
                byte[] data = File.ReadAllBytes(filePath);

                context.Response.ContentType = mime;
                context.Response.ContentLength64 = data.Length;
                context.Response.OutputStream.Write(data, 0, data.Length);
            }
            else
            {
                context.Response.StatusCode = 404;
                byte[] data = System.Text.Encoding.UTF8.GetBytes("404 Not Found");
                context.Response.OutputStream.Write(data, 0, data.Length);
            }
        }
        catch { }
        finally
        {
            context.Response.Close();
        }
    }

    static string GetMimeType(string ext)
    {
        switch (ext)
        {
            case ".html": return "text/html; charset=utf-8";
            case ".js": return "application/javascript; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".svg": return "image/svg+xml";
            case ".png": return "image/png";
            case ".jpg": case ".jpeg": return "image/jpeg";
            case ".ico": return "image/x-icon";
            case ".json": return "application/json";
            default: return "application/octet-stream";
        }
    }
}
