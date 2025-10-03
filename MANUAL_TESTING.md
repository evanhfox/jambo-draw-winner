# Manual Testing Guide for Contest Draw Platform

Since the automated environment setup is having issues, here's a comprehensive manual testing guide to verify all functionality.

## 🚀 Quick Start Instructions

### Option 1: Using Node.js (Recommended)

1. **Install Node.js** (if not already installed):
   ```bash
   # Using Homebrew (macOS)
   brew install node
   
   # Or download from https://nodejs.org/
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open browser** and go to `http://localhost:8080`

### Option 2: Using Docker

1. **Start Docker Desktop** (if not running)

2. **Build the image**:
   ```bash
   docker build -t contest-draw-winner .
   ```

3. **Run the container**:
   ```bash
   docker run -p 3000:80 contest-draw-winner
   ```

4. **Open browser** and go to `http://localhost:3000`

## 🧪 Manual Testing Checklist

### 1. **Initial Page Load**
- [ ] Page loads without errors
- [ ] Title "Contest Draw Platform" is visible
- [ ] Subtitle "Secure, auditable, and truly random winner selection" is visible
- [ ] "Download Sample CSV" button is present
- [ ] File upload area is visible with drag-and-drop instructions

### 2. **File Upload Testing**

#### **Sample CSV Download**
- [ ] Click "Download Sample CSV" button
- [ ] File downloads successfully
- [ ] Open downloaded file and verify format: `name,email`

#### **CSV File Upload**
- [ ] Create a test CSV file with at least 7 participants:
  ```csv
  Alice Johnson,alice@example.com
  Bob Smith,bob@example.com
  Charlie Brown,charlie@example.com
  Diana Wilson,diana@example.com
  Eve Davis,eve@example.com
  Frank Miller,frank@example.com
  Grace Taylor,grace@example.com
  Henry Lee,henry@example.com
  ```
- [ ] Upload via drag-and-drop
- [ ] Upload via click-to-browse
- [ ] Verify participants list appears
- [ ] Verify count shows "X total entries"

#### **Edge Cases**
- [ ] Try uploading non-CSV file (should be ignored)
- [ ] Try uploading empty CSV (should show 0 entries)
- [ ] Try uploading CSV with less than 7 participants
- [ ] Try uploading CSV with special characters in names

### 3. **Draw Process Testing**

#### **Valid Draw**
- [ ] Upload CSV with 7+ participants
- [ ] Click "Draw 7 Winners" button
- [ ] Verify "Drawing Winners..." animation appears
- [ ] Wait for draw to complete (1.5 seconds)
- [ ] Verify "Winners Selected!" appears
- [ ] Verify exactly 7 winners are displayed
- [ ] Verify winners are from the original participant list
- [ ] Verify no duplicate winners

#### **Invalid Draw**
- [ ] Upload CSV with less than 7 participants
- [ ] Click "Draw 7 Winners" button
- [ ] Verify error message appears
- [ ] Verify draw button remains enabled

#### **Draw Button States**
- [ ] Button is disabled during drawing
- [ ] Button is disabled after successful draw
- [ ] Button is enabled after reset

### 4. **Winners Display Testing**

#### **Winner Information**
- [ ] Each winner shows name and email
- [ ] Winners are numbered 1-7
- [ ] Winners have animated appearance (staggered)
- [ ] Winner cards have proper styling

#### **Draw Metadata**
- [ ] Draw ID is displayed (8-character string)
- [ ] Timestamp is displayed
- [ ] Method shows "Cryptographically secure random selection"
- [ ] Total participants count is correct

#### **Report Download**
- [ ] Click "Download Audit Report (TXT + JSON)" button
- [ ] Verify two files download:
  - `contest-draw-report-[ID].txt`
  - `contest-draw-data-[ID].json`
- [ ] Open TXT file and verify:
  - Draw ID and timestamp
  - Winner list with names and emails
  - Technical details about randomization
- [ ] Open JSON file and verify:
  - Complete draw data
  - Technical implementation details
  - Audit information

### 5. **Randomness Visualization Testing**

#### **Visualization Component**
- [ ] Component appears after file upload
- [ ] Shows "Randomness Process Visualization" title
- [ ] Shows three steps:
  1. Generate Random Values
  2. Apply Fisher-Yates Shuffle
  3. Select Winners
- [ ] "Demonstrate Randomization Process" button is present

#### **Demonstration**
- [ ] Click demonstration button
- [ ] Verify button shows "Demonstrating Process..."
- [ ] Watch step-by-step animation (3 seconds total)
- [ ] Verify "Example Shuffle Result" appears
- [ ] Verify first 7 positions are highlighted
- [ ] Verify technical notes are displayed

### 6. **Technical Details Testing**

#### **Expandable Section**
- [ ] Scroll to bottom of page
- [ ] Find "About This Draw System" section
- [ ] Click "Show Technical Implementation Details"
- [ ] Verify expanded content shows:
  - Random Number Generation details
  - Shuffle Algorithm code
  - Security Properties
  - Browser Compatibility
- [ ] Click "Hide Technical Implementation Details"
- [ ] Verify content collapses

#### **Security Information**
- [ ] Verify "🔒 How Our Randomness Works" section
- [ ] Check Cryptographic Security explanation
- [ ] Check Fisher-Yates Shuffle explanation
- [ ] Check Step-by-Step Process

### 7. **Reset Functionality Testing**

#### **Reset Process**
- [ ] After successful draw, click reset button (↻ icon)
- [ ] Verify page returns to initial state
- [ ] Verify file upload area reappears
- [ ] Verify participants list disappears
- [ ] Verify winners display disappears

### 8. **Responsive Design Testing**

#### **Desktop (1920x1080)**
- [ ] Layout is properly structured
- [ ] All elements are visible and accessible
- [ ] Text is readable
- [ ] Buttons are clickable

#### **Tablet (768x1024)**
- [ ] Layout adapts to smaller screen
- [ ] Components stack vertically if needed
- [ ] Touch targets are appropriate size

#### **Mobile (375x667)**
- [ ] Layout is mobile-friendly
- [ ] Text is readable without zooming
- [ ] Buttons are touch-friendly
- [ ] File upload works on mobile

### 9. **Accessibility Testing**

#### **Keyboard Navigation**
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Focus indicators are visible

#### **Screen Reader**
- [ ] Use browser's accessibility tools
- [ ] Verify all text is readable
- [ ] Verify button labels are descriptive

#### **Color Contrast**
- [ ] Text is readable against backgrounds
- [ ] Important elements stand out
- [ ] Color is not the only way to convey information

### 10. **Performance Testing**

#### **Large Files**
- [ ] Upload CSV with 100+ participants
- [ ] Verify page remains responsive
- [ ] Verify draw completes in reasonable time
- [ ] Verify no memory leaks

#### **Multiple Draws**
- [ ] Perform multiple draws in sequence
- [ ] Verify each draw produces different results
- [ ] Verify page remains stable

### 11. **Security Testing**

#### **Randomness Verification**
- [ ] Perform multiple draws with same participants
- [ ] Verify different winners each time
- [ ] Verify no predictable patterns
- [ ] Check audit reports for consistency

#### **Data Integrity**
- [ ] Verify winners are always from participant list
- [ ] Verify no duplicate winners
- [ ] Verify draw metadata is accurate

## 🐛 Common Issues & Solutions

### **File Upload Not Working**
- Check browser console for errors
- Verify file is actually CSV format
- Try different file sizes

### **Draw Button Disabled**
- Ensure at least 7 participants uploaded
- Check for JavaScript errors in console
- Try refreshing the page

### **Styling Issues**
- Clear browser cache
- Check if CSS is loading properly
- Verify Tailwind CSS is working

### **Download Not Working**
- Check browser's download settings
- Verify popup blockers aren't interfering
- Try different browser

## 📊 Expected Results

### **Successful Test Run Should Show:**
- ✅ All file upload methods work
- ✅ Draw process completes successfully
- ✅ Winners are randomly selected
- ✅ Reports download correctly
- ✅ All animations work smoothly
- ✅ Responsive design functions
- ✅ Accessibility features work
- ✅ No console errors
- ✅ Performance is acceptable

### **Security Verification:**
- ✅ Different winners each draw
- ✅ No predictable patterns
- ✅ Complete audit trail
- ✅ Cryptographic randomness used

## 🎯 Test Completion

Once all tests pass, your Contest Draw Platform is ready for production use! The application provides:

- **Secure randomization** using cryptographic methods
- **Complete transparency** with detailed explanations
- **Audit trail** with downloadable reports
- **Professional UI** with smooth animations
- **Accessibility** compliance
- **Responsive design** for all devices

## 🚀 Next Steps

After successful testing:
1. **Deploy to production** using Docker or hosting platform
2. **Set up monitoring** for performance and errors
3. **Configure SSL** for secure HTTPS access
4. **Set up backups** for audit reports
5. **Document deployment** process for team

Happy testing! 🎉
