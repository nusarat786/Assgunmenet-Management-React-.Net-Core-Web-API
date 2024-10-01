//using IronPython.Hosting;
//using System;
//using System.Diagnostics;
//using System.IO;
//using System.Reflection;

//namespace Code
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string function_code,String test)
//        {
//            try
//            {
//                // Save code to a temporary file
//                var tempFileName = Path.GetTempFileName() + ".cs";
//                test = test.Trim();
//                string code = test+ function_code +"}" ;
//                Debug.WriteLine(code);
//                File.WriteAllText(tempFileName, code);

//                // Compile the code
//                var processStartInfo = new ProcessStartInfo
//                {
//                    FileName = "csc.exe",
//                    Arguments = $"/out:OutputAssembly.dll {tempFileName}",
//                    RedirectStandardOutput = true,
//                    RedirectStandardError = true,
//                    UseShellExecute = false,
//                    CreateNoWindow = true
//                };

//                var process = Process.Start(processStartInfo);
//                process.WaitForExit();

//                var errors = process.StandardError.ReadToEnd();
//                if (!string.IsNullOrEmpty(errors))
//                {
//                    return $"Compilation errors: {errors}";
//                }

//                // Load and execute the compiled assembly
//                var assembly = Assembly.LoadFile(Path.Combine(Directory.GetCurrentDirectory(), "OutputAssembly.dll"));
//                var type = assembly.GetTypes()[0]; // Assuming one type per assembly
//                var method = type.GetMethod("Execute", BindingFlags.Public | BindingFlags.Static);
//                var result = method.Invoke(null, null);

//                // Clean up
//                File.Delete(tempFileName);
//                File.Delete("OutputAssembly.dll");

//                return result?.ToString() ?? "No result";
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecutePythonCode(string code)
//        {
//            try
//            {
//                var pythonEngine = Python.CreateEngine();
//                var result = pythonEngine.Execute(code);
//                return result.ToString();
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing Python code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension,string abc)
//        {
//            if (fileExtension == ".cs")
//            {
//                return ExecuteCSharpCode(code,abc);
//            }
//            else if (fileExtension == ".py")
//            {
//                return ExecutePythonCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}


//using IronPython.Hosting;
//using System;
//using System.Diagnostics;
//using System.IO;
//using System.Reflection;

//namespace Code
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                // Save code to a temporary file
//                var tempFileName = Path.GetTempFileName() + ".cs";

//                Debug.WriteLine(code);
//                File.WriteAllText(tempFileName, code);

//                // Compile the code
//                var processStartInfo = new ProcessStartInfo
//                {
//                    FileName = "csc.exe",
//                    Arguments = $"/out:OutputAssembly.dll {tempFileName}",
//                    RedirectStandardOutput = true,
//                    RedirectStandardError = true,
//                    UseShellExecute = false,
//                    CreateNoWindow = true
//                };

//                var process = Process.Start(processStartInfo);
//                process.WaitForExit();

//                var errors = process.StandardError.ReadToEnd();
//                if (!string.IsNullOrEmpty(errors))
//                {
//                    return $"Compilation errors: {errors}";
//                }

//                // Load and execute the compiled assembly
//                var assembly = Assembly.LoadFile(Path.Combine(Directory.GetCurrentDirectory(), "OutputAssembly.dll"));
//                var type = assembly.GetTypes()[0]; // Assuming one type per assembly
//                var method = type.GetMethod("Execute", BindingFlags.Public | BindingFlags.Static);
//                var result = method.Invoke(null, null);

//                // Clean up
//                File.Delete(tempFileName);
//                File.Delete("OutputAssembly.dll");

//                return result?.ToString() ?? "No result";
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecutePythonCode(string code)
//        {
//            try
//            {
//                var pythonEngine = Python.CreateEngine();
//                var result = pythonEngine.Execute(code);
//                return result.ToString();
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing Python code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs")
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else if (fileExtension == ".py")
//            {
//                return ExecutePythonCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}



//using IronPython.Hosting;
//using System;
//using System.Diagnostics;
//using System.IO;
//using System.Reflection;

//namespace Code
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                // Save the code to a temporary file
//                var tempFileName = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".cs");
//                File.WriteAllText(tempFileName, code);

//                // Define the output DLL path
//                var outputDllPath = Path.Combine(Directory.GetCurrentDirectory(), "OutputAssembly.dll");

//                // Compile the code using csc.exe
//                var processStartInfo = new ProcessStartInfo
//                {
//                    FileName = @"C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe", // Ensure this path is correct for your environment
//                    Arguments = $"/out:\"{outputDllPath}\" \"{tempFileName}\"",
//                    RedirectStandardOutput = true,
//                    RedirectStandardError = true,
//                    UseShellExecute = false,
//                    CreateNoWindow = true
//                };

//                var process = Process.Start(processStartInfo);
//                process.WaitForExit();

//                var errors = process.StandardError.ReadToEnd();
//                if (!string.IsNullOrEmpty(errors))
//                {
//                    return $"Compilation errors: {errors}";
//                }

//                // Check if the DLL was created
//                if (!File.Exists(outputDllPath))
//                {
//                    return "Error: Compiled DLL not found. " + outputDllPath;
//                }

//                // Load and execute the compiled assembly
//                var assembly = Assembly.LoadFile(outputDllPath);
//                var type = assembly.GetTypes()[0]; // Assuming one type per assembly
//                var method = type.GetMethod("Execute", BindingFlags.Public | BindingFlags.Static);
//                var result = method.Invoke(null, null);

//                // Clean up
//                File.Delete(tempFileName);
//                File.Delete(outputDllPath);

//                return result?.ToString() ?? "No result";
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecutePythonCode(string code)
//        {
//            try
//            {
//                var pythonEngine = Python.CreateEngine();
//                var result = pythonEngine.Execute(code);
//                return result.ToString();
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing Python code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs")
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else if (fileExtension == ".py")
//            {
//                return ExecutePythonCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}



