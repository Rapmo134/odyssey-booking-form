"use client"

export default function GlobalStyleTest() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Global Style Test</h2>
      
      {/* Test Select Elements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Elements Test</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Basic Select (should have global style):</label>
          <select className="w-64">
            <option value="">Select an option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select with custom width (should have global style + custom width):</label>
          <select className="w-32 h-8 text-xs">
            <option value="">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select with utility class (fallback):</label>
          <select className="global-select w-48">
            <option value="">Select with utility class</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </select>
        </div>
      </div>
      
      {/* Test Radio Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Radio Buttons Test</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Basic Radio (should have global style):</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="test-radio" value="1" />
              <span>Option 1</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="test-radio" value="2" />
              <span>Option 2</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Radio with utility class (fallback):</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" className="global-radio" name="test-radio-2" value="1" />
              <span>Option 1</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" className="global-radio" name="test-radio-2" value="2" />
              <span>Option 2</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Test Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Checkboxes Test</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Basic Checkbox (should have global style):</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="test-checkbox" />
              <span>Check me</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="test-checkbox" />
              <span>Check me too</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Checkbox with utility class (fallback):</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="global-checkbox" name="test-checkbox-2" />
              <span>Check me</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="global-checkbox" name="test-checkbox-2" />
              <span>Check me too</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Test Text Inputs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Text Inputs Test</h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Basic Text Input (should have global style):</label>
          <input type="text" placeholder="Enter your name" className="w-64" />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email Input (should have global style):</label>
          <input type="email" placeholder="Enter your email" className="w-64" />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input with utility class (fallback):</label>
          <input type="text" placeholder="Enter with utility class" className="global-input w-64" />
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How to Test:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All form elements should have consistent styling</li>
          <li>• Select elements should have gray border, padding, and blue focus ring</li>
          <li>• Radio buttons and checkboxes should be 16x16px with blue color</li>
          <li>• Text inputs should have gray border, padding, and blue focus ring</li>
          <li>• If global styles don't work, utility classes (global-*) should work as fallback</li>
        </ul>
      </div>
    </div>
  )
} 