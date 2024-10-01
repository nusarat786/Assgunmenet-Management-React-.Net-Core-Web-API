using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var testCases = new List<(string, int, int)>
        {
            ("abcde", 3, 3),   // "abc"
            ("hello", 5, 2),   // "he"
            ("abcdef", 10, 0), // ""
            ("zzzz", 26, 4),   // "zzzz"
            ("", 1, 0),
            ("a", 1, 1),
            ("abcdefg", 6, 3), // "abc"
            ("abba", 2, 4),    // "abba"
        };

        int totalTests = testCases.Count;
        int passedTests = 0;

        foreach (var (s, k, expected) in testCases)
        {
            int result = LengthOfLongestSubarrayDivisibleByK(s, k);
            if (result == expected)
            {
                passedTests++;
            }
        }

        Console.WriteLine($"[code]{passedTests}/{totalTests}[/code]");
    }