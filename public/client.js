
//This code, var express through app.set('port',3000) is code from lectures and the class. The implementation that I have is the exact same as the lectures
//This program is a game where there are 100 random zip codes from US locations. You have to guess the temperature within 5 degrees without knowing the name
//of the city. You get 3 points for a correct answer and lose 1 point for an incorrect. 






document.addEventListener('DOMContentLoaded', buttonSet);
document.addEventListener('DOMContentLoaded', function()
		{
			console.log("DOM DRAW called ------------------------------------------------")
			drawTable();
		});
			
//First we will reset the database. When this loads, it will simply draw the table. 

function reset_table()
{
	req.open('GET', 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/reset-table', true);
	req.addEventListener('load', function()
	{
		drawTable();
	});
}
//This is the basic code of the game. 

//Deleted all of the node listeners, this is straight Javascript. 

function drawTable()
{
	var req = new XMLHttpRequest();
	
console.log("gets into drawTable at least");

	//This removes the current table if there is one
	if(document.getElementById("dataTable") != null)
	{			
		console.log("Table deleting triggered -------------------------------------------------------------------------------------------------");
		var eltable = document.getElementById("dataTable");
		eltable.parentNode.removeChild(eltable);

		
	}
	
	req.open('GET', 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/tables', true);
	req.addEventListener('load', function()
	{
		if(req.status >= 200 && req.status < 400)
		{
			//console.log("Request was returned");
			//console.log("Respons was: ", req.responseText);
			var response = JSON.parse(req.responseText);  
			//console.log("after parsing response was: ", response);
			var newTable = document.createElement('table');
			newTable.id="dataTable";
			
			var newHead = document.createElement('thead');		//Create header
			var newRow = document.createElement('tr');
			var newBody = document.createElement("tbody");
			
			//console.log("Created header stubs");		
			
			var nameTitle = document.createElement('th');
			nameTitle.textContent = 'Name';
			newRow.appendChild(nameTitle);
			
			var repsTitle = document.createElement('th');
			repsTitle.textContent = 'Reps';
			newRow.appendChild(repsTitle);
			
			var weightTitle = document.createElement('th');
			weightTitle.textContent = 'Weight';
			newRow.appendChild(weightTitle);
			
			var dateTitle = document.createElement('th');
			dateTitle.textContent = 'Date';
			newRow.appendChild(dateTitle);
			
			var lbsTitle = document.createElement('th');
			lbsTitle.textContent = 'Lbs';
			newRow.appendChild(lbsTitle);
			
			newHead.appendChild(newRow);
			//The above should build the header. Next we can do the actual data in the body
			//Now we need to build the body, and to do that we need to do a loop, I think for each will work. 
			//console.log("Appended headers to head");		
			for(var thing in response)
			{
				//console.log("Appending rows in loop");
				var nextRow = document.createElement('tr');
				
				var nameBox = document.createElement('td');
				nameBox.textContent=response[thing].name;
				nextRow.appendChild(nameBox);
				//console.log("Doing name: ", response[thing].name);
				var repsBox = document.createElement('td');
				repsBox.textContent=response[thing].reps;
				nextRow.appendChild(repsBox);
				
				var weightBox = document.createElement('td');
				weightBox.textContent=response[thing].weight;
				nextRow.appendChild(weightBox);
				
				var dateBox = document.createElement('td');
				dateBox.textContent=response[thing].date;
				nextRow.appendChild(dateBox);
				
				var lbsBox = document.createElement('td');
				lbsBox.textContent=response[thing].lbs;
				nextRow.appendChild(lbsBox);
				
				newBody.appendChild(nextRow);
				
				//Above code adds the data row, next rows add the buttons. 
				
				var buttonRow = document.createElement('tr');
				
				
				//This is my attempt a closure. 
				var deleteButton = document.createElement('button');
				
				
				
				var editButton = document.createElement('button');
				
				//The next two blocks hopefully create hidden data items with the id that follows each button.
				//I hope to be able to access them since they are siblings. 
				
				var hidDeleteID = document.createElement('hidden');
				hidDeleteID.name="hidden thing";
				hidDeleteID.value=response[thing].id;
				deleteButton.value=response[thing].id;
				
				var hidUpdateID = document.createElement('hidden');
				hidUpdateID.name="id";
				hidUpdateID.value=response[thing].id;
				editButton.value=response[thing].id;
				
				var deleteText = document.createTextNode("Delete");
				var editText = document.createTextNode("Edit");
			
				deleteButton.appendChild(deleteText);
				editButton.appendChild(editText);
				
				deleteButton.className="deleteButton";
				editButton.className="editButton";
				
				//This sets up a closure so the correct deleteButton gets passed

				buttonRow.appendChild(deleteButton);
				buttonRow.appendChild(hidDeleteID);
				buttonRow.appendChild(editButton);
				buttonRow.appendChild(hidUpdateID);

				newBody.appendChild(buttonRow);
				
			
				
			}
			newTable.appendChild(newHead);
			newTable.appendChild(newBody);

			document.body.appendChild(newTable);

			buttonAssign();
			

		}
		else
		{
			console.log("Something wrong with request, response code was: ", req.status);
			
		}
		

	});
	
	req.send(null);
	event.preventDefault();	
}

function buttonAssign()
{
	var delReq = new XMLHttpRequest();
//This sets up the delete buttons
	var deleteButtons = document.getElementsByClassName("deleteButton");
	for(var j=0; j<deleteButtons.length; j++)
	{
		deleteButtons[j].onclick = (function(delBut)
				{
					return function()
					{
						//console.log("delete button id is: ", delBut.value);  //Note to test git. 
						var url = 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/delete' + '?id=' + delBut.value;
						delReq.open('GET', url, true);
						delReq.addEventListener('load', function()
						{
							if(delReq.status >= 200 && delReq.status < 400)
							{
								document.body.removeChild;
								//console.log("Great, deleted row");
								//console.log("Row index test, row index is:", delBut.rowIndex);
								//delBut.nextSibling.nextSibling.nextSibling.removeNode;
								//delBut.nextSibling.nextSibling.removeNode;
								//delBut.nextSibling.removeNode;
								//delBut.parentNode.removeChild(delBut);
								console.log("Drawing table in button Assign --------------------------------------------------------------")
								drawTable();
							}
							else
							{
								console.log("Error deleting item, bad server response");

							}
						});
						
						delReq.send(null);
						//event.preventDefault();	
						
					}
				}(deleteButtons[j]));
				
		
		
	}
//This sets up the edit buttons


	var editButtons = document.getElementsByClassName("editButton");
	for(var j=0; j<editButtons.length; j++)
	{
		//This assigns to every delete Button a function where it will draw a little form after the table, that form will let you enter the new info and click update. Update will send a
		//get request to simple-update, then it will redraw table. 
		editButtons[j].onclick = (function(edBut)
				{
					return function()
					{
						var updateReq = new XMLHttpRequest();
						

						
						var url = 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/generate-update-form-data' + '?id=' + edBut.value;
						updateReq.open('GET', url, true);
						updateReq.addEventListener('load', function()
						{
							if(updateReq.status >= 200 && updateReq.status < 400)
							{
								
								if(document.getElementById('updateDiv'))
								{
									console.log("is this happenig once?");
									var delNode = document.getElementById('updateDiv');
									document.body.removeChild(delNode);
									
									//document.getElementById('efDiv').removeChild(onlyChild);
							
								}
								
						
								console.log("getting into response");
								var editResponse = JSON.parse(updateReq.responseText);
								
								console.log("here is the response name", editResponse[0].name);
								
								var efDiv = document.createElement('div');
								
								efDiv.id = 'updateDiv';
				
								var editForm = document.createElement('form');
								editForm.id = edBut.value;
								editForm.class="editTableClass";
								
								var fieldsetEditForm = document.createElement('fieldset');
								
								var nameInput = document.createElement('input');
								nameInput.type = 'text';
								nameInput.value = editResponse[0].name;
								nameInput.id = 'editName';
								
								var edNameTitle = document.createTextNode('Name:');
								
								
								
								
								var repsInput = document.createElement('input');
								repsInput.type = 'number';
								repsInput.value = editResponse[0].reps;
								repsInput.id = 'editReps';
								
								var edRepsTitle = document.createTextNode('Reps:');
								
								var weightInput = document.createElement('input');
								weightInput.type = 'number';
								weightInput.value = editResponse[0].weight;
								weightInput.id = 'editWeight';
								
								var edWeightTitle = document.createTextNode('Weight:');
								
								var dateInput = document.createElement('input');
								dateInput.type = 'date';
								dateInput.value = editResponse[0].date;
								dateInput.id = 'editDate';
								
								var edDateTitle = document.createTextNode('Date:, if you enter no date, it will be updated to null');
								
								var radio1 = document.createElement('input');
								radio1.type = 'radio';
								radio1.name = 'editlbs';
								radio1.id = 'editlbsYes';
								radio1.text = 'Yes';
								

								
								var edlbsYesTitle = document.createTextNode('lbs: Yes');
								
								var radio2 = document.createElement('input');
								radio2.type = 'radio';
								radio2.name = 'editlbs';
								radio2.id = 'editlbsNo';
								radio2.text = 'No';
								
								if(editResponse[0].lbs == 1)
								{
									radio1.checked='checked';
								}
								else
								{
									radio2.checked='checked';
								}
								
								var edlbsNoTitle = document.createTextNode('No ');
								
								var editSubmit = document.createElement('input');
								editSubmit.id = 'submitEditForm';
								editSubmit.innerHTML = 'Submit';
								editSubmit.type = 'submit';
								
								fieldsetEditForm.appendChild(edNameTitle);
								fieldsetEditForm.appendChild(nameInput);
								fieldsetEditForm.appendChild(edRepsTitle);
								fieldsetEditForm.appendChild(repsInput);
								fieldsetEditForm.appendChild(edWeightTitle);
								fieldsetEditForm.appendChild(weightInput);

								
								fieldsetEditForm.appendChild(dateInput);
								
								fieldsetEditForm.appendChild(edlbsYesTitle);
								
								fieldsetEditForm.appendChild(radio1);
								
								
								fieldsetEditForm.appendChild(edlbsNoTitle);
								fieldsetEditForm.appendChild(radio2);
								fieldsetEditForm.appendChild(edDateTitle);
								fieldsetEditForm.appendChild(dateInput);
								fieldsetEditForm.appendChild(editSubmit);
								
								editForm.appendChild(fieldsetEditForm);
								//editForm.appendChild(editSubmit);
								efDiv.appendChild(editForm);
								
								document.body.appendChild(efDiv);
								
								//This is too complicated to do the option for lbs right now, I am coming back to that part
								

								editFormCatcher();

							}
							else
							{
								console.log("Error deleting item, bad server response");

							}
						});

						updateReq.send(null);
						event.preventDefault();	
						
					}
				}(editButtons[j]));
				
		
		
	}
	
	
}


function editFormCatcher()
{
	
	console.log("Got into form catcher ------------------------------------------------------------------------------------------------------")

	var editButton = document.getElementById("submitEditForm");
	
	editButton.addEventListener('click', function(event)
	{
		console.log("This should be here for edit button if it is working ");
		var editReq = new XMLHttpRequest();
	
		var name = document.getElementById('editName').value;
		var reps = document.getElementById('editReps').value;
		var weight = document.getElementById('editWeight').value;
		var date = document.getElementById('editDate').value;
		var editID = document.getElementById('updateDiv').firstChild.id;

		
		var edlbs;
		
		if(document.getElementById('editlbsYes').checked)
		{
			edlbs=1;
			
		}
		else
		{
			edlbs=0;
		}
		
		var lbs = 1;
		
		console.log("Form data name", name);
		var subUrl = 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/simple-update' + '?name=' + name  + '&' +  'reps=' + reps + '&' + 'weight=' + weight +  '&' + 'date=' + date +'&' + 'lbs=' + edlbs + '&' + 'subID=' + editID;

		editReq.open('GET', subUrl, true);
		editReq.addEventListener('load',function()
		{
			if(editReq.status >= 200 && editReq.status < 400)
			{
				var delNode = document.getElementById('updateDiv');
				document.body.removeChild(delNode);
				drawTable();
			}
			else
			{
				console.log("Unsuccessful add to table " + request.statusText);
			}
			
			
			
		});
		editReq.send(null);
		event.preventDefault();
	});
	

	
}



function buttonSet()
{

	var subButton = document.getElementById("addSubmit");
	
	subButton.onclick = function(event)
	{
	
		var addReq = new XMLHttpRequest();
	
		var name = document.getElementById('nameVal').value;
		var reps = document.getElementById('repsVal').value;
		var weight = document.getElementById('weightVal').value;
		var date = document.getElementById('dateVal').value;
		var lbs;
		
		if(document.getElementById('lbsYes').checked)
		{
			lbs=1;
			
		}
		else
		{
			lbs=0;
		}
		console.log("Form data name", name);
		var subUrl = 'http://ec2-52-26-46-121.us-west-2.compute.amazonaws.com:1976/insert' + '?name=' + name  + '&' +  'reps=' + reps + '&' + 'weight=' + weight +  '&' + 'date=' + date +'&' + 'lbs=' + lbs;

		addReq.open('GET', subUrl, true);
		addReq.addEventListener('load',function()
		{
			if(addReq.status >= 200 && addReq.status < 400)
			{
				console.log("Drawing table in add --------------------------------------------------------------------------------");
				drawTable();
			}
			else
			{
				console.log("Unsuccessful add to table " + request.statusText);
			}
			
			
			
		});
		addReq.send(null);
		event.preventDefault();
	};
	
	  
	
}








