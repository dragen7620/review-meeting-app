const handleTrigger = async (action) => {
    setLoading(true);
    setResultLinks(null);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action }),
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("無法解析伺服器回傳內容：" + text.substring(0, 100));
      }

      if (data.status === 'error') {
        alert('Apps Script 執行回傳錯誤：\n' + data.message);
      } else {
        setResultLinks(data);
      }
    } catch (e) {
      alert('請求中斷或失敗：' + e.message + '\n\n請確認 Apps Script 部署版本是否為最新，且存取權限設為「所有人」。');
    }
    setLoading(false);
  };
