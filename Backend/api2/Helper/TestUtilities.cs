using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Text.RegularExpressions;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

namespace CAC
{
    public static class CodeExecutor
    {
        public static string ExecuteCSharpCode(string code)
        {
            try
            {
                var syntaxTree = CSharpSyntaxTree.ParseText(code);

                var references = new[]
                {
                    // Core .NET assemblies
                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location), // System.Object
                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location), // System.Console
                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location), // System.Linq.Enumerable
                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location), // System.Runtime

                    // Collections and LINQ
                    MetadataReference.CreateFromFile(typeof(List<>).Assembly.Location), // System.Collections.Generic.List<>
                    MetadataReference.CreateFromFile(typeof(Dictionary<,>).Assembly.Location), // System.Collections.Generic.Dictionary<,>
                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location), // System.Linq.Enumerable

                    // Regular expressions and I/O
                    MetadataReference.CreateFromFile(typeof(Regex).Assembly.Location), // System.Text.RegularExpressions.Regex
                    MetadataReference.CreateFromFile(typeof(Stream).Assembly.Location), // System.IO.Stream

                    // Reflection and Assembly loading
                    MetadataReference.CreateFromFile(typeof(Assembly).Assembly.Location), // System.Reflection.Assembly
                    MetadataReference.CreateFromFile(typeof(AssemblyLoadContext).Assembly.Location), // System.Runtime.Loader.AssemblyLoadContext

                    // Threading
                    MetadataReference.CreateFromFile(typeof(System.Threading.Tasks.Task).Assembly.Location), // System.Threading.Tasks.Task
                    MetadataReference.CreateFromFile(typeof(System.Threading.Thread).Assembly.Location), // System.Threading.Thread

                    // Collections
                    MetadataReference.CreateFromFile(typeof(System.Collections.Concurrent.ConcurrentDictionary<,>).Assembly.Location), // System.Collections.Concurrent.ConcurrentDictionary<,>
                    MetadataReference.CreateFromFile(typeof(System.Collections.Concurrent.ConcurrentBag<>).Assembly.Location), // System.Collections.Concurrent.ConcurrentBag<>

                    // Additional types
                    MetadataReference.CreateFromFile(typeof(System.Net.Http.HttpClient).Assembly.Location), // System.Net.Http.HttpClient
                    MetadataReference.CreateFromFile(typeof(System.Text.StringBuilder).Assembly.Location), // System.Text.StringBuilder
                    MetadataReference.CreateFromFile(typeof(System.Globalization.CultureInfo).Assembly.Location), // System.Globalization.CultureInfo
                    MetadataReference.CreateFromFile(typeof(System.Security.Cryptography.MD5).Assembly.Location), // System.Security.Cryptography.MD5


                    MetadataReference.CreateFromFile(Assembly.Load("System.Collections, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a").Location),


                };

                // Generate a unique assembly name
                var assemblyName = $"DynamicAssembly_{Guid.NewGuid()}";

                var compilation = CSharpCompilation.Create(
                    assemblyName,
                    new[] { syntaxTree },
                    references,
                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

                using (var ms = new MemoryStream())
                {
                    var result = compilation.Emit(ms);

                    if (result.Success)
                    {
                        ms.Seek(0, SeekOrigin.Begin);
                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);

                        // Redirect console output to capture the result
                        using (var sw = new StringWriter())
                        {
                            var originalOut = Console.Out;
                            try
                            {
                                Console.SetOut(sw);

                                // Check if the Main method takes parameters
                                var parameters = method?.GetParameters();
                                if (parameters?.Length == 0)
                                {
                                    method?.Invoke(null, null);
                                }
                                else
                                {
                                    method?.Invoke(null, new object[] { new string[] { } });
                                }

                                var res = ExtractCodeBlock(sw.ToString());
                                return res;
                            }
                            finally
                            {
                                // Restore the original console output
                                Console.SetOut(originalOut);
                            }
                        }
                    }
                    else
                    {
                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
                        return $"Compilation errors: {errors}";
                    }
                }
            }
            catch (Exception ex)
            {
                return $"Error executing C# code: {ex.Message}";
            }
        }

        public static string ExecuteCode(string code, string fileExtension)
        {
            if (fileExtension == "c#")
            {
                return ExecuteCSharpCode(code);
            }
            else
            {
                return "Unsupported file type";
            }
        }

        static string ExtractCodeBlock(string input)
        {
            // Regular expression to find content between [code] and [/code]
            var match = Regex.Match(input, @"\[code\](.*?)\[/code\]", RegexOptions.Singleline);

            Console.WriteLine(match.Success);
            if (match.Success)
            {
                // Return the content between [code] and [/code]
                return match.Groups[1].Value;
            }
            else
            {
                // Return the original string if [code] tags are not found
                return input;
            }
        }
    }
}






//--------------------------------------------------------------------------------------------------------------------


//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using System.Text.RegularExpressions;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                var references = new[]
//                {
//                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                };

//                // Generate a unique assembly name
//                var assemblyName = $"DynamicAssembly_{Guid.NewGuid()}";

//                var compilation = CSharpCompilation.Create(
//                    assemblyName,
//                    new[] { syntaxTree },
//                    references,
//                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
//                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);

//                        // Redirect console output to capture the result
//                        using (var sw = new StringWriter())
//                        {
//                            var originalOut = Console.Out;
//                            try
//                            {
//                                Console.SetOut(sw);

//                                // Check if the Main method takes parameters
//                                var parameters = method?.GetParameters();
//                                if (parameters?.Length == 0)
//                                {
//                                    method?.Invoke(null, null);
//                                }
//                                else
//                                {
//                                    method?.Invoke(null, new object[] { new string[] { } });
//                                }

//                                var res = ExtractCodeBlock(sw.ToString());
//                                return res;
//                            }
//                            finally
//                            {
//                                // Restore the original console output
//                                Console.SetOut(originalOut);
//                            }
//                        }
//                    }
//                    else
//                    {
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == "c#")
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }

//        static string ExtractCodeBlock(string input)
//        {
//            // Regular expression to find content between [code] and [/code]
//            var match = Regex.Match(input, @"\[code\](.*?)\[/code\]", RegexOptions.Singleline);

//            Console.WriteLine(match.Success);
//            if (match.Success)
//            {
//                // Return the content between [code] and [/code]
//                return match.Groups[1].Value;
//            }
//            else
//            {
//                // Return the original string if [code] tags are not found
//                return input;
//            }
//        }
//    }
//}


// -----------------------------------------------------------------------------------------------------------------------




















//////using System;
//////using System.Collections.Generic;
//////using System.Diagnostics;
//////using System.IO;
//////using System.Linq;
//////using System.Reflection;
//////using System.Text.Json;
//////using System.Threading.Tasks;
//////using Microsoft.CodeAnalysis;
//////using Microsoft.CodeAnalysis.CSharp;

//////public static class TestUtilities
//////{
//////    public static string FormatJsonString(string jsonString)
//////    {
//////        using (JsonDocument document = JsonDocument.Parse(jsonString))
//////        {
//////            string cleanJsonString = JsonSerializer.Serialize(document.RootElement, new JsonSerializerOptions { WriteIndented = true });
//////            return cleanJsonString;
//////        }
//////    }

//////    public static List<TestCase> ParseTestCases(string jsonString)
//////    {
//////        var testCases = new List<TestCase>();
//////        using (JsonDocument document = JsonDocument.Parse(jsonString))
//////        {
//////            var root = document.RootElement;
//////            if (root.TryGetProperty("testCase", out var testCaseArray))
//////            {
//////                foreach (var testCase in testCaseArray.EnumerateArray())
//////                {
//////                    var input = testCase.GetProperty("input").EnumerateArray()
//////                        .Select(e => e.GetInt32()).ToList();
//////                    var output = testCase.GetProperty("output").EnumerateArray()
//////                        .Select(e => e.GetInt32()).ToList();

//////                    testCases.Add(new TestCase
//////                    {
//////                        Input = input,
//////                        Output = output
//////                    });
//////                }
//////            }
//////        }
//////        return testCases;
//////    }

//////    public static async Task<List<TestResult>> RunTestsAsync(string code, List<TestCase> testCases, string language)
//////    {
//////        var results = new List<TestResult>();
//////        var filePath = Path.GetTempFileName();

//////        // Write the code to a file
//////        File.WriteAllText(filePath, code);

//////        if (language == "java")
//////        {
//////            results = await RunJavaTestsAsync(filePath, testCases);
//////        }
//////        else if (language == "csharp")
//////        {
//////            results = await RunCSharpTestsAsync(filePath, testCases);
//////        }
//////        else if (language == "python")
//////        {
//////            results = await RunPythonTestsAsync(filePath, testCases);
//////        }
//////        else
//////        {
//////            throw new NotSupportedException($"Language '{language}' is not supported.");
//////        }

//////        string formattedResults = FormatJsonString(JsonSerializer.Serialize(results, new JsonSerializerOptions { WriteIndented = true }));
//////        Console.WriteLine(formattedResults);

//////        return results;
//////    }

//////    private static async Task<List<TestResult>> RunJavaTestsAsync(string filePath, List<TestCase> testCases)
//////    {
//////        var results = new List<TestResult>();
//////        var classFilePath = Path.ChangeExtension(filePath, ".class");
//////        var compileProcess = new Process
//////        {
//////            StartInfo = new ProcessStartInfo
//////            {
//////                FileName = "javac",
//////                Arguments = filePath,
//////                UseShellExecute = false,
//////                CreateNoWindow = true
//////            }
//////        };
//////        compileProcess.Start();
//////        compileProcess.WaitForExit();

//////        foreach (var testCase in testCases)
//////        {
//////            var inputString = string.Join(",", testCase.Input);
//////            var expectedOutputString = string.Join(",", testCase.Output);

//////            var process = new Process
//////            {
//////                StartInfo = new ProcessStartInfo
//////                {
//////                    FileName = "java",
//////                    Arguments = $"{Path.GetFileNameWithoutExtension(filePath)}",
//////                    RedirectStandardInput = true,
//////                    RedirectStandardOutput = true,
//////                    UseShellExecute = false,
//////                    CreateNoWindow = true
//////                }
//////            };

//////            process.Start();
//////            using (var streamWriter = process.StandardInput)
//////            {
//////                if (!string.IsNullOrEmpty(inputString))
//////                {
//////                    streamWriter.WriteLine(inputString);
//////                }
//////            }

//////            var output = await process.StandardOutput.ReadToEndAsync();
//////            process.WaitForExit();

//////            var actualOutput = output.Split(',').Select(int.Parse).ToList();

//////            results.Add(new TestResult
//////            {
//////                Input = testCase.Input,
//////                ExpectedOutput = testCase.Output,
//////                ActualOutput = actualOutput,
//////                Correct = actualOutput.SequenceEqual(testCase.Output)
//////            });
//////        }

//////        return results;
//////    }

//////    private static async Task<List<TestResult>> RunCSharpTestsAsync(string filePath, List<TestCase> testCases)
//////    {
//////        var results = new List<TestResult>();
//////        var compiledFilePath = Path.ChangeExtension(filePath, ".dll");
//////        var compileProcess = new Process
//////        {
//////            StartInfo = new ProcessStartInfo
//////            {
//////                FileName = "dotnet",
//////                Arguments = $"build {filePath} -o {compiledFilePath}",
//////                UseShellExecute = false,
//////                CreateNoWindow = true
//////            }
//////        };
//////        compileProcess.Start();
//////        compileProcess.WaitForExit();

//////        var assembly = Assembly.LoadFile(compiledFilePath);
//////        var type = assembly.GetType("Program"); // Adjust class name if needed
//////        var method = type.GetMethod("SortList"); // Adjust method name if needed

//////        foreach (var testCase in testCases)
//////        {
//////            var result = InvokeMethod(method, testCase.Input);

//////            results.Add(new TestResult
//////            {
//////                Input = testCase.Input,
//////                ExpectedOutput = testCase.Output,
//////                ActualOutput = result,
//////                Correct = result.SequenceEqual(testCase.Output)
//////            });
//////        }

//////        return results;
//////    }

//////    private static async Task<List<TestResult>> RunPythonTestsAsync(string filePath, List<TestCase> testCases)
//////    {
//////        var results = new List<TestResult>();

//////        foreach (var testCase in testCases)
//////        {
//////            var inputString = string.Join(",", testCase.Input);
//////            var expectedOutputString = string.Join(",", testCase.Output);

//////            var process = new Process
//////            {
//////                StartInfo = new ProcessStartInfo
//////                {
//////                    FileName = "python",
//////                    Arguments = filePath,
//////                    RedirectStandardInput = true,
//////                    RedirectStandardOutput = true,
//////                    UseShellExecute = false,
//////                    CreateNoWindow = true
//////                }
//////            };

//////            process.Start();
//////            using (var streamWriter = process.StandardInput)
//////            {
//////                if (!string.IsNullOrEmpty(inputString))
//////                {
//////                    streamWriter.WriteLine(inputString);
//////                }
//////            }

//////            var output = await process.StandardOutput.ReadToEndAsync();
//////            process.WaitForExit();

//////            var actualOutput = output.Split(',').Select(int.Parse).ToList();

//////            results.Add(new TestResult
//////            {
//////                Input = testCase.Input,
//////                ExpectedOutput = testCase.Output,
//////                ActualOutput = actualOutput,
//////                Correct = actualOutput.SequenceEqual(testCase.Output)
//////            });
//////        }

//////        return results;
//////    }

//////    private static List<int> InvokeMethod(MethodInfo method, List<int> input)
//////    {
//////        var instance = Activator.CreateInstance(method.DeclaringType);
//////        var result = (List<int>)method.Invoke(instance, new object[] { input });
//////        return result;
//////    }
//////}

//////public class TestCase
//////{
//////    public List<int> Input { get; set; }
//////    public List<int> Output { get; set; }
//////}

//////public class TestResult
//////{
//////    public List<int> Input { get; set; }
//////    public List<int> ExpectedOutput { get; set; }
//////    public List<int> ActualOutput { get; set; }
//////    public bool Correct { get; set; }
//////}


////using System;
////using System.CodeDom.Compiler;
////using System.IO;
////using System.Net.Http;
////using System.Reflection;
////using System.Threading.Tasks;
////using Microsoft.CSharp;

////public static class CodeExecutor
////{
////    private static readonly HttpClient _httpClient = new HttpClient();

////    public static async Task<string> ExecuteCodeAsync(string code, string fileUrl)
////    {
////        try
////        {
////            // Fetch the file content from the URL
////            var fileContent = await FetchFileContentAsync(fileUrl);

////            // Determine the file extension from the URL
////            var fileExtension = Path.GetExtension(fileUrl)?.ToLower();

////            // Decide compilation based on the file extension
////            if (fileExtension == ".cs")
////            {
////                return ExecuteCSharpCode(code, fileContent);
////            }

////            // Add more conditions here for other languages if needed
////            // else if (fileExtension == ".py") { // Python logic }
////            // else if (fileExtension == ".java") { // Java logic }

////            return $"File extension '{fileExtension}' is not supported.";
////        }
////        catch (Exception ex)
////        {
////            return $"Error: {ex.Message}";
////        }
////    }

////    private static async Task<string> FetchFileContentAsync(string fileUrl)
////    {
////        try
////        {
////            var response = await _httpClient.GetAsync(fileUrl);
////            response.EnsureSuccessStatusCode();
////            return await response.Content.ReadAsStringAsync();
////        }
////        catch (Exception ex)
////        {
////            throw new Exception($"Failed to fetch the file from the URL: {ex.Message}");
////        }
////    }

////    private static string ExecuteCSharpCode(string code, string testFileContent)
////    {
////        // Combine code and test file content if needed
////        var combinedCode = $"{testFileContent}{Environment.NewLine}{code}";

////        using (var csharpProvider = new CSharpCodeProvider())
////        {
////            var compilerParameters = new CompilerParameters
////            {
////                GenerateExecutable = false,
////                GenerateInMemory = true
////            };

////            var results = csharpProvider.CompileAssemblyFromSource(compilerParameters, combinedCode);

////            if (results.Errors.HasErrors)
////            {
////                var errors = string.Join(Environment.NewLine, results.Errors.Cast<CompilerError>().Select(e => e.ErrorText));
////                return $"Compilation failed: {errors}";
////            }

////            var assembly = results.CompiledAssembly;
////            var entryPoint = assembly.EntryPoint;
////            if (entryPoint == null)
////            {
////                return "No entry point found in the code.";
////            }

////            var instance = assembly.CreateInstance(entryPoint.DeclaringType.FullName);
////            var output = entryPoint.Invoke(instance, null);

////            return output?.ToString() ?? "Code executed successfully, but no output was generated.";
////        }
////    }
////}



// main

//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using System.Threading.Tasks;
//using IronPython.Hosting;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        // Method to compile and execute C# code
//        public static async Task<string> ExecuteCSharpCodeAsync(string code)
//        {
//            try
//            {
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                var compilation = CSharpCompilation.Create(
//                    "DynamicAssembly",
//                    new[] { syntaxTree },
//                    new[]
//                    {
//                        MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                        MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location)
//                    },
//                    new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().First();
//                        var method = type.GetMethod("Execute", BindingFlags.Public | BindingFlags.Static);

//                        var resultValue = method.Invoke(null, null);
//                        return resultValue?.ToString() ?? "No result";
//                    }
//                    else
//                    {
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Method to execute Python code
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

//        // Combined method to execute code based on file extension
//        public static async Task<string> ExecuteCodeAsync(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return await ExecuteCSharpCodeAsync(code);
//            }
//            else if (fileExtension == ".py") // Python
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

// main end


//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using System.Threading.Tasks;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        // Asynchronous method to compile and execute C# code
//        public static async Task<string> ExecuteCSharpCodeAsync(string code)
//        {
//            try
//            {
//                return await Task.Run(() =>
//                {
//                    // Parse the code into a syntax tree
//                    var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                    // Define the required references for compilation
//                    var references = new[]
//                    {
//                        MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                        MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                        MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                        MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                    };

//                    // Create the compilation object
//                    var compilation = CSharpCompilation.Create(
//                        "DynamicAssembly",
//                        new[] { syntaxTree },
//                        references,
//                        new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                    // Emit the compiled code to an in-memory stream
//                    using (var ms = new MemoryStream())
//                    {
//                        var result = compilation.Emit(ms);

//                        if (result.Success)
//                        {
//                            ms.Seek(0, SeekOrigin.Begin);
//                            var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                            var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
//                            var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.Public);

//                            // Redirect console output to capture the result
//                            using (var sw = new StringWriter())
//                            {
//                                Console.SetOut(sw);
//                                method?.Invoke(null, null);
//                                return sw.ToString().Trim();
//                            }
//                        }
//                        else
//                        {
//                            // Return compilation errors
//                            var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                            return $"Compilation errors: {errors}";
//                        }
//                    }
//                });
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Combined method to execute code based on file extension
//        public static async Task<string> ExecuteCodeAsync(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return await ExecuteCSharpCodeAsync(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}



//// 

//////////// mian in
//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        // Method to compile and execute C# code
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                // Parse the code into a syntax tree
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                // Define the required references for compilation
//                var references = new[]
//                {
//                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                };

//                // Create the compilation object
//                var compilation = CSharpCompilation.Create(
//                    "DynamicAssembly",
//                    new[] { syntaxTree },
//                    references,
//                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                // Emit the compiled code to an in-memory stream
//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "SortingTest");
//                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.NonPublic);

//                        // Redirect console output to capture the result
//                        using (var sw = new StringWriter())
//                        {
//                            Console.SetOut(sw);
//                            method?.Invoke(null, new object[] { new string[] { } });
//                            return sw.ToString();
//                        }
//                    }
//                    else
//                    {
//                        // Return compilation errors
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Combined method to execute code based on file extension
//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}
//////////// mian in end

//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        // Method to compile and execute C# code
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                // Parse the code into a syntax tree
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                // Define the required references for compilation
//                var references = new[]
//                {
//                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                };

//                // Create the compilation object
//                var compilation = CSharpCompilation.Create(
//                    "DynamicAssembly",
//                    new[] { syntaxTree },
//                    references,
//                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                // Emit the compiled code to an in-memory stream
//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
//                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.Public);

//                        // Redirect console output to capture the result
//                        using (var sw = new StringWriter())
//                        {
//                            Console.SetOut(sw);
//                            method?.Invoke(null, null);
//                            return sw.ToString() + "test ";
//                        }
//                    }
//                    else
//                    {
//                        // Return compilation errors
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Combined method to execute code based on file extension
//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}











/////


//using System;
//using System.Threading.Tasks;
//using IronPython.Hosting;
//using ScriptCs.Contracts;
//using ScriptCs.Engine.Roslyn;
//using ScriptCs.Hosting;

//namespace CAS
//{
//    public static class CodeExecutor
//    {
//        // Method to execute C# code using ScriptCS
//        public static async Task<string> ExecuteCSharpCodeAsync(string code)
//        {
//            try
//            {
//                var scriptServicesBuilder = new ScriptServicesBuilder();
//                var scriptServices = scriptServicesBuilder.Build();

//                var engine = new RoslynScriptEngine(scriptServices.Executor, scriptServices.Logger, new ScriptHostFactory(scriptServices.Logger), scriptServices.FilePreProcessor);
//                var executionResult = engine.Execute(code);

//                if (executionResult.CompileExceptionInfo != null)
//                {
//                    return $"Compilation Error: {executionResult.CompileExceptionInfo.SourceException.Message}";
//                }

//                if (executionResult.ExecuteExceptionInfo != null)
//                {
//                    return $"Runtime Error: {executionResult.ExecuteExceptionInfo.SourceException.Message}";
//                }

//                return executionResult.ReturnValue?.ToString() ?? "No result";
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Method to execute Python code
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

//        // Combined method to execute code based on file extension
//        public static async Task<string> ExecuteCodeAsync(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return await ExecuteCSharpCodeAsync(code);
//            }
//            else if (fileExtension == ".py") // Python
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


//using CSScriptLib;
//using CSScriptLibrary;
//using System;
//using System.Threading.Tasks;

//namespace YourNamespace
//{
//    public static class CodeExecutor
//    {
//        public static async Task<string> ExecuteCSharpCodeAsync(string code)
//        {
//            try
//            {
//                // This is where the C# script is compiled and executed
//                var script = CSScript.Evaluator.LoadCode<string>(code);

//                // Assuming the script returns a string, you can adjust this as needed
//                return script;
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        // Example for handling Python code
//        public static string ExecutePythonCode(string code)
//        {
//            try
//            {
//                var pythonEngine = IronPython.Hosting.Python.CreateEngine();
//                var result = pythonEngine.Execute(code);
//                return result.ToString();
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing Python code: {ex.Message}";
//            }
//        }

//        // Combined method to execute code based on file extension
//        public static async Task<string> ExecuteCodeAsync(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs") // C#
//            {
//                return await ExecuteCSharpCodeAsync(code);
//            }
//            else if (fileExtension == ".py") // Python
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


//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                var references = new[]
//                {
//                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                };

//                var compilation = CSharpCompilation.Create(
//                    "DynamicAssembly",
//                    new[] { syntaxTree },
//                    references,
//                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
//                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);

//                        // Redirect console output to capture the result
//                        using (var sw = new StringWriter())
//                        {
//                            var originalOut = Console.Out;
//                            try
//                            {
//                                Console.SetOut(sw);

//                                // Check if the Main method takes parameters
//                                var parameters = method?.GetParameters();
//                                if (parameters?.Length == 0)
//                                {
//                                    method?.Invoke(null, null);
//                                }
//                                else
//                                {
//                                    method?.Invoke(null, new object[] { new string[] { } });
//                                }

//                                return sw.ToString();
//                            }
//                            finally
//                            {
//                                // Restore the original console output
//                                Console.SetOut(originalOut);
//                            }
//                        }
//                    }
//                    else
//                    {
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs")
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}



//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Runtime.Loader;
//using Microsoft.CodeAnalysis;
//using Microsoft.CodeAnalysis.CSharp;

//namespace CAC
//{
//    public static class CodeExecutor
//    {
//        public static string ExecuteCSharpCode(string code)
//        {
//            try
//            {
//                var syntaxTree = CSharpSyntaxTree.ParseText(code);

//                var references = new[]
//                {
//                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
//                    MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
//                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
//                };

//                // Use a unique name for each assembly
//                var assemblyName = $"DynamicAssembly_{Guid.NewGuid()}";

//                var compilation = CSharpCompilation.Create(
//                    assemblyName,
//                    new[] { syntaxTree },
//                    references,
//                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

//                using (var ms = new MemoryStream())
//                {
//                    var result = compilation.Emit(ms);

//                    if (result.Success)
//                    {
//                        ms.Seek(0, SeekOrigin.Begin);
//                        var assembly = AssemblyLoadContext.Default.LoadFromStream(ms);
//                        var type = assembly.GetTypes().FirstOrDefault(t => t.Name == "Program");
//                        var method = type?.GetMethod("Main", BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);

//                        using (var sw = new StringWriter())
//                        {
//                            var originalOut = Console.Out;
//                            try
//                            {
//                                Console.SetOut(sw);

//                                // Check if the Main method takes parameters
//                                var parameters = method?.GetParameters();
//                                if (parameters?.Length == 0)
//                                {
//                                    method?.Invoke(null, null);
//                                }
//                                else
//                                {
//                                    method?.Invoke(null, new object[] { new string[] { } });
//                                }

//                                return sw.ToString();
//                            }
//                            finally
//                            {
//                                Console.SetOut(originalOut);
//                            }
//                        }
//                    }
//                    else
//                    {
//                        var errors = string.Join(Environment.NewLine, result.Diagnostics.Select(d => d.ToString()));
//                        return $"Compilation errors: {errors}";
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error executing C# code: {ex.Message}";
//            }
//        }

//        public static string ExecuteCode(string code, string fileExtension)
//        {
//            if (fileExtension == ".cs")
//            {
//                return ExecuteCSharpCode(code);
//            }
//            else
//            {
//                return "Unsupported file type";
//            }
//        }
//    }
//}



