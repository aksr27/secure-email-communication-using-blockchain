import React, { Component } from "react";

let crypt = null;
let privateKey = null;
let publickey = null;

class GenerateKeys extends Component {
  key_size() {
    document.getElementById("myDropdown").classList.toggle("show");
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
      if (!event.target.matches(".change-key-size")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }
      }
      //Change the key size value for new keys
      $(".change-key-size").each(function (index, value) {
        var el = $(value);
        var keySize = el.attr("data-value");
        el.click(function (e) {
          var button = $("#key-size");
          button.attr("data-value", keySize);
          button.html(keySize + " bits");
          e.preventDefault();
        });
      });
    };
  }

  generateKeypair() {
    var sKeySize = $("#key-size").attr("data-value");
    var keySize = parseInt(sKeySize);
    var crypt = new JSEncrypt({ default_key_size: keySize });
    var async = $("#async-gen").is(":checked");
    var dt = new Date();
    var time = -dt.getTime();
    var id = document
      .getElementById("blockstack_ID")
      .value.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var blockstack_user = document
      .getElementById("user")
      .innerHTML.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var pass = document.getElementById("passphrase").value;
    if (id.trim() == "") {
      $("#blockstack_id_message").text("Please enter your blockstack ID...");
    }
    else if (!id.trim().endsWith("id.blockstack")) {
      $("#blockstack_id_message").text("Invalid blockstack ID...");
    }
    else if (id.trim() != blockstack_user) {
      $("#blockstack_id_message").text("This blockstack ID does not belong to this account!");
    }
    else if (pass == "") {
      $("#blockstack_id_message").text("");
      $("#five-words").text("Please enter your passphrase...");
    }
    else if (pass.split(" ").join("").length < 7) {
      $("#blockstack_id_message").text("");
      $("#five-words").text("Passphrase must have at least 7 characters!");
    }
    else {
      $("#blockstack_id_message").text("");
      $("#five-words").text("");
      if (async) {
        $("#time-report").text(".");
        var load = setInterval(function () {
          var text = $("#time-report").text();
          $("#time-report").text(text + ".");
        }, 500);
        crypt.getKey(function () {
          clearInterval(load);
          dt = new Date();
          time += dt.getTime();
          $("#time-report").text("Generated in " + time + " ms");
          $("#privkey").val(crypt.getPrivateKey());
          $("#pubkey").val(crypt.getPublicKey());
        });
        return;
      }
      crypt.getKey();
      dt = new Date();
      time += dt.getTime();
      $("#time-report").text("Generated in " + time + " ms");
      $("#privkey").val(crypt.getPrivateKey());
      $("#pubkey").val(crypt.getPublicKey());
    }
    document.getElementById("pubgenkey").value = document.getElementById(
      "pubkey"
    ).value;
  }

  clearAll() {
    document.getElementById("passphrase").value = "";
    document.getElementById("pubkey").value = "";
    document.getElementById("privkey").value = "";
    document.getElementById("time-report").text = "";
    document.getElementById("async-gen").checked = false;
    document.getElementById("pub_other_peer_pkey").value = "";
  }

  savePubkeyAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: ".asc" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    if (document.getElementById("pubkey").value == "") {
      alert("Public key can't be empty!");
    }
    else if (
      !document
        .getElementById("pubkey")
        .value.startsWith("-----BEGIN PUBLIC KEY-----") &&
      !document
        .getElementById("pubkey")
        .value.endsWith("-----END PUBLIC KEY-----")
    ) {
      alert("Invalid public key!");
    }
    else if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink.download);
    }

    downloadLink.click();
  }

  savePubkeyOtherPairAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: ".asc" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;

    if (document.getElementById("pub_other_peer_pkey").value == "") {
      alert("Public key can't be empty!");
    }
    else if (
      !document
        .getElementById("pub_other_peer_pkey")
        .value.startsWith("-----BEGIN PUBLIC KEY-----") &&
      !document
        .getElementById("pub_other_peer_pkey")
        .value.endsWith("-----END PUBLIC KEY-----")
    ) {
      alert("Invalid public key!");
    }
    else if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
    }
    else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink.download);
    }

    downloadLink.click();
  }

  savePrivkeyAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: ".asc" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;

    if (document.getElementById("privkey").value == "") {
      alert("Private key can't be empty!");
    }
    else if (
      !document
        .getElementById("privkey")
        .value.startsWith("-----BEGIN RSA PRIVATE KEY-----") &&
      !document
        .getElementById("privkey")
        .value.endsWith("-----END RSA PRIVATE KEY-----")
    ) {
      alert("Invalid private key key!");
    }
    else if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
    }
    else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink.download);
    }

    downloadLink.click();
  }

  render() {
    return (
      <div className="container">
        <div id="Generate Keys" className="tabcontent">
          <h2 className="generating_keys">Generating a PGP pair of keys with RSA algorithm</h2>
          <br />
          <br />
          <div className="block">
            <label htmlFor="blockstack_ID">Enter your blockstack ID:</label>
            <br />
            <input
              type="text"
              id="blockstack_ID"
              className="blockstack_ID"
              placeholder="Enter your blockstack id..."
              onChange={e => this.generateKeypair(e)}
            />
            <br />
            <strong id="blockstack_id_message" className="blockstack_id_message"></strong>
            <br />
            <br />
            <label htmlFor="passphrase">Choose a passphrase:</label>
            <br />
            <input
              type="pass"
              name="passphrase"
              id="passphrase"
              className="passphrase"
              placeholder="Enter your passphrase..."
            />
            <br />
            <strong id="five-words" className="passlength"></strong>
            <br />
            <br />
            <label htmlFor="key_size">Key Size:</label>

            <button
              id="key-size"
              className="change-key-size"
              data-value="2048"
              onClick={e => this.key_size(e)}
            >
              2048 bits (Default) - Click to change size
            </button>
            <div className="dropdown">
              <div id="myDropdown" className="dropdown-content">
                <a
                  className="change-key-size"
                  data-value="512"
                  onClick={e => this.key_size(e)}
                >
                  512 bits
                  <br />
                  (Not recommended)
                </a>
                <a
                  className="change-key-size"
                  data-value="1024"
                  onClick={e => this.key_size(e)}
                >
                  1024 bits
                  <br />
                  (For testing purposes only)
                </a>
                <a
                  className="change-key-size"
                  data-value="2048"
                  onClick={e => this.key_size(e)}
                >
                  2048 bits
                  <br />
                  (Secure-Recommended)
                </a>
                <a
                  className="change-key-size"
                  data-value="4096"
                  onClick={e => this.key_size(e)}
                >
                  4096 bits
                  <br />
                  (More secure)
                </a>
              </div>
            </div>
            <label htmlFor="async-gen">
              Async
              <input
                id="async-gen"
                type="checkbox"
                className="my_input"
              ></input>
            </label>

            <br />
            <br />
            <button
              className="btn btn-primary"
              value="Generate PGP Keys"
              id="generate"
              onClick={e => this.generateKeypair(e)}
            >
              Generate PGP Keys
            </button>
            <br></br>
            <span>
              <i>
                <small id="time-report" className="time-report"></small>
              </i>
            </span>
          </div>

          <br />
          <div className="block">
            <label htmlFor="pubkey">Public Key</label>
            <br />
            <textarea
              id="pubkey"
              className="pubkey"
              rows="15"
              cols="69"
            ></textarea>
            <br />
            <button
              type="save"
              className="btn-dl"
              onClick={e =>
                this.savePubkeyAsFile(pubkey.value, "public_key.asc")
              }
            >
              Download Public Key
            </button>
            <br />
            <br />
            <label htmlFor="privkey">Private Key</label>
            <br />
            <textarea
              id="privkey"
              className="privkey"
              rows="15"
              cols="69"
            ></textarea>
            <br />
            <button
              type="save"
              className="btn-dl"
              onClick={e =>
                this.savePrivkeyAsFile(privkey.value, "private_key.asc")
              }
            >
              Download Private Key
            </button>
            <br />
            <br />
            <label htmlFor="pub_other_peer_pkey">Other Peer's Public Key</label>
            <br />
            <textarea
              id="pub_other_peer_pkey"
              className="pub_other_peer_pkey"
              rows="15"
              cols="69"
            ></textarea>
            <br />
            <button
              type="save"
              className="btn-dl"
              onClick={e =>
                this.savePubkeyOtherPairAsFile(
                  pub_other_peer_pkey.value,
                  "other_peer_public_key.asc"
                )
              }
            >
              Download Public Key
            </button>
            <br />
          </div>
          <br />

          <button
            type="reset"
            className="btn-res"
            value="Reset"
            onClick={e => this.clearAll(e)}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}
export default GenerateKeys;
