1| // ============================================
2| // Navigation and Menu Functions
3| // ============================================
4| 
5| /**
6|  * Opens the side menu by setting width
7|  */
8| function openMenu() {
9|   const sideMenu = document.getElementById("sideMenu");
10|   if (sideMenu) {
11|     sideMenu.style.width = "350px";
12|   }
13| }
14| 
15| /**
16|  * Closes the side menu
17|  */
18| function closeMenu() {
19|   const sideMenu = document.getElementById("sideMenu");
20|   if (sideMenu) {
21|     sideMenu.style.width = "0";
22|   }
23| }
24| 
25| /**
26|  * Displays a specific section in the menu
27|  * @param {string} id - The ID of the section to display
28|  */
29| function showSection(id) {
30|   const sections = document.getElementsByClassName("menuContent");
31|   for (let i = 0; i < sections.length; i++) {
32|     sections[i].style.display = "none";
33|     sections[i].classList.remove("active");
34|   }
35|   const targetSection = document.getElementById(id);
36|   if (targetSection) {
37|     targetSection.style.display = "block";
38|     targetSection.classList.add("active");
39|   }
40| }
41| 
42| /**
43|  * Opens a specific page and hides others
44|  * @param {string} page - The ID of the page to display
45|  */
46| function openPage(page) {
47|   const pages = document.querySelectorAll(".page");
48|   pages.forEach(p => {
49|     p.classList.remove("active");
50|   });
51|   
52|   const targetPage = document.getElementById(page);
53|   if (targetPage) {
54|     targetPage.classList.add("active");
55|   }
56|   
57|   // Close menu when navigating
58|   closeMenu();
59| }
60| 
61| /**
62|  * Returns to the home page
63|  */
64| function goHome() {
65|   openPage("home");
66| }
67| 
68| // ============================================
69| // Form Handling Functions
70| // ============================================
71| 
72| /**
73|  * Handles farmer registration form submission
74|  */
75| function handleFarmerRegistration(e) {
76|   e.preventDefault();
77|   
78|   const formData = new FormData(document.getElementById("farmerForm"));
79|   const data = Object.fromEntries(formData);
80|   
81|   // Validate required fields
82|   if (!data.fullName || !data.phone) {
83|     alert("Please fill in all required fields!");
84|     return;
85|   }
86|   
87|   // Log the data (in production, send to server)
88|   console.log("Farmer Registration Data:", data);
89|   
90|   // Show success message
91|   showNotification("Farmer Registered Successfully!", "success");
92|   
93|   // Reset form
94|   document.getElementById("farmerForm").reset();
95|   
96|   // Redirect after 2 seconds
97|   setTimeout(() => {
98|     goHome();
99|   }, 2000);
100| }
101| 
102| /**
103|  * Handles farmer profile update
104|  */
105| function handleProfileUpdate(e) {
106|   e.preventDefault();
107|   
108|   const formData = new FormData(e.target);
109|   const data = Object.fromEntries(formData);
110|   
111|   console.log("Profile Update Data:", data);
112|   showNotification("Profile Updated Successfully!", "success");
113|   
114|   setTimeout(() => {
115|     openPage("agriculture");
116|   }, 2000);
117| }
118| 
119| /**
120|  * Handles product addition form
121|  */
122| function handleAddProduct(e) {
123|   e.preventDefault();
124|   
125|   const formData = new FormData(e.target);
126|   const data = Object.fromEntries(formData);
127|   
128|   console.log("Product Data:", data);
129|   showNotification("Product Added Successfully!", "success");
130|   
131|   e.target.reset();
132|   
133|   setTimeout(() => {
134|     openPage("agriculture");
135|   }, 2000);
136| }
137| 
138| // ============================================
139| // Notification System
140| // ============================================
141| 
142| /**
143|  * Shows a notification message
144|  * @param {string} message - The message to display
145|  * @param {string} type - The type of notification (success, error, info)
146|  * @param {number} duration - Duration in milliseconds (default: 3000)
147|  */
148| function showNotification(message, type = "info", duration = 3000) {
149|   // Remove existing notification if any
150|   const existingNotification = document.getElementById("notification");
151|   if (existingNotification) {
152|     existingNotification.remove();
153|   }
154|   
155|   // Create notification element
156|   const notification = document.createElement("div");
157|   notification.id = "notification";
158|   notification.className = `notification notification-${type}`;
159|   notification.textContent = message;
160|   
161|   // Add styles
162|   notification.style.cssText = `
163|     position: fixed;
164|     top: 20px;
165|     right: 20px;
166|     padding: 15px 20px;
167|     border-radius: 5px;
168|     color: white;
169|     font-weight: bold;
170|     z-index: 2000;
171|     animation: slideIn 0.3s ease-in;
172|     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
173|   `;
174|   
175|   // Set background color based on type
176|   const colors = {
177|     success: "#0b7d3b",
178|     error: "#d32f2f",
179|     info: "#1976d2"
180|   };
181|   
182|   notification.style.backgroundColor = colors[type] || colors.info;
183|   
184|   // Add to document
185|   document.body.appendChild(notification);
186|   
187|   // Auto-remove after duration
188|   setTimeout(() => {
189|     notification.style.animation = "slideOut 0.3s ease-out";
190|     setTimeout(() => {
191|       notification.remove();
192|     }, 300);
193|   }, duration);
194| }
195| 
196| // ============================================
197| // Data Management
198| // ============================================
199| 
200| /**
201|  * Local storage management for user data
202|  */
203| const StorageManager = {
204|   /**
205|    * Save user data to local storage
206|    * @param {string} key - Storage key
207|    * @param {object} data - Data to store
208|    */
209|   save: function(key, data) {
210|     try {
211|       localStorage.setItem(key, JSON.stringify(data));
212|       return true;
213|     } catch (e) {
214|       console.error("Storage error:", e);
215|       return false;
216|     }
217|   },
218|   
219|   /**
220|    * Retrieve data from local storage
221|    * @param {string} key - Storage key
222|    * @returns {object|null} Retrieved data or null
223|    */
224|   get: function(key) {
225|     try {
226|       const data = localStorage.getItem(key);
227|       return data ? JSON.parse(data) : null;
228|     } catch (e) {
229|       console.error("Storage error:", e);
230|       return null;
231|     }
232|   },
233|   
234|   /**
235|    * Remove data from local storage
236|    * @param {string} key - Storage key
237|    */
238|   remove: function(key) {
239|     try {
240|       localStorage.removeItem(key);
241|       return true;
242|     } catch (e) {
243|       console.error("Storage error:", e);
244|       return false;
245|     }
246|   },
247|   
248|   /**
249|    * Clear all data from local storage
250|    */
251|   clear: function() {
252|     try {
253|       localStorage.clear();
254|       return true;
255|     } catch (e) {
256|       console.error("Storage error:", e);
257|       return false;
258|     }
259|   }
260| };
261| 
262| // ============================================
263| // Shopping Cart Functions
264| // ============================================
265| 
266| const Cart = {
267|   /**
268|    * Add item to cart
269|    * @param {object} item - Product item
270|    */
271|   addItem: function(item) {
272|     let cart = StorageManager.get("cart") || [];
273|     
274|     // Check if item already exists
275|     const existingItem = cart.find(i => i.id === item.id);
276|     if (existingItem) {
277|       existingItem.quantity += item.quantity || 1;
278|     } else {
279|       cart.push(item);
280|     }
281|     
282|     StorageManager.save("cart", cart);
283|     showNotification("Item added to cart!", "success");
284|   },
285|   
286|   /**
287|    * Remove item from cart
288|    * @param {string} itemId - Product ID
289|    */
290|   removeItem: function(itemId) {
291|     let cart = StorageManager.get("cart") || [];
292|     cart = cart.filter(i => i.id !== itemId);
293|     StorageManager.save("cart", cart);
294|   },
295|   
296|   /**
297|    * Get cart items
298|    * @returns {array} Cart items
299|    */
300|   getItems: function() {
301|     return StorageManager.get("cart") || [];
302|   },
303|   
304|   /**
305|    * Clear cart
306|    */
307|   clear: function() {
308|     StorageManager.remove("cart");
309|   },
310|   
311|   /**
312|    * Get cart total
313|    * @returns {number} Total price
314|    */
315|   getTotal: function() {
316|     const items = this.getItems();
317|     return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
318|   }
319| };

