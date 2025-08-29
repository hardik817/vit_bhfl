const http = require('http');

// Test cases based on the examples
const testCases = [
    {
        name: "Example A",
        data: {
            data: ["a", "1", "334", "4", "R", "$"]
        },
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334", "4"],
            alphabets: ["A", "R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "rA"
        }
    },
    {
        name: "Example B",
        data: {
            data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"]
        },
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2", "4", "92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "bYa"
        }
    },
    {
        name: "Example C",
        data: {
            data: ["A", "ABcD", "DOE"]
        },
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A", "ABCD", "DOE"],
            special_characters: [],
            sum: "0",
            concat_string: "eOdDcBaA"
        }
    }
];

function runTest(testCase, port = 3000) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(testCase.data);

        const options = {
            hostname: 'localhost',
            port: port,
            path: '/bfhl',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log(`\n📝 Test: ${testCase.name}`);
                    console.log('Request:', JSON.stringify(testCase.data, null, 2));
                    console.log('Response:', JSON.stringify(response, null, 2));

                    // Validate response
                    let passed = true;
                    const errors = [];

                    if (!response.is_success) {
                        errors.push('is_success should be true');
                        passed = false;
                    }

                    // Check arrays
                    ['odd_numbers', 'even_numbers', 'alphabets', 'special_characters'].forEach(field => {
                        if (JSON.stringify(response[field]) !== JSON.stringify(testCase.expected[field])) {
                            errors.push(`${field} mismatch. Expected: ${JSON.stringify(testCase.expected[field])}, Got: ${JSON.stringify(response[field])}`);
                            passed = false;
                        }
                    });

                    // Check sum
                    if (response.sum !== testCase.expected.sum) {
                        errors.push(`sum mismatch. Expected: ${testCase.expected.sum}, Got: ${response.sum}`);
                        passed = false;
                    }

                    // Check concat_string
                    if (response.concat_string !== testCase.expected.concat_string) {
                        errors.push(`concat_string mismatch. Expected: ${testCase.expected.concat_string}, Got: ${response.concat_string}`);
                        passed = false;
                    }

                    if (passed) {
                        console.log('✅ Test PASSED');
                    } else {
                        console.log('❌ Test FAILED');
                        errors.forEach(error => console.log(`   - ${error}`));
                    }

                    resolve(passed);
                } catch (e) {
                    console.error('Failed to parse response:', e);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

async function runAllTests() {
    console.log('🚀 Starting API Tests (LOCAL)...');
    console.log('Make sure your server is running on http://localhost:3000\n');

    let allPassed = true;

    for (const testCase of testCases) {
        try {
            const passed = await runTest(testCase);
            if (!passed) allPassed = false;
        } catch (error) {
            console.error(`Test ${testCase.name} failed with error:`, error);
            allPassed = false;
        }
    }

    console.log('\n' + '='.repeat(50));
    if (allPassed) {
        console.log('✅ All tests PASSED locally!');
    } else {
        console.log('❌ Some tests FAILED locally.');
    }
}

// Run tests
runAllTests().catch(console.error);
