document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
    var newURL = "https://www.facebook.com/";
    //Must not make the tab active, or the popup will be destroyed preventing any
    //  further processing.
    chrome.tabs.create({ url: newURL,active:false }, function(tab){
        console.log('Attempting to inject script into tab:',tab);
        chrome.tabs.executeScript(tab.id,{code:`
            (function(){
                var count = 100; //Only try 100 times
                function changeLoginWhenExists(){
                    var loginField = document.getElementById("email");
                    var passwordField = document.getElementById("pass");
                    //loginField and passwordField are each an HTMLCollection
                    if( loginField && passwordField ){
                        loginField.value = 'quangkebg123@gmail.com';
                        passwordField.value = '28071997';
                        document.querySelector("#loginbutton").click();
                    } else {
                        if(count-- > 0 ){
                            //The elements we need don't exist yet, wait a bit to try again.
                            //This could more appropriately be a MutationObserver
                            setTimeout(changeLoginWhenExists,250);
                        }
                    }
                }
                changeLoginWhenExists();
            })();
        `},function(results){
            //Now that we are done with processing, make the tab active. This will
            //  close/destroy the popup.
            
            chrome.tabs.update(tab.id,{active:true});
        });
    });
  }, false);
}, false);