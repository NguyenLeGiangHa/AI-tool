'use client'
import React, { useState, useEffect, Suspense } from 'react';
import personaImage from './persona.jpg'
import Image from 'next/image';
import { User, Briefcase, BarChart, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Head from 'next/head'


interface PersonaData {
  tomTatTongQuan: string;
  nguCanhKinhDoanh: {
    personaDoanhNghiep: string;
    chiSoKinhDoanh: string;
    conNguoiVaQuyTrinh: string;
    giaiPhap: string;
  };
  doLuongThanhCong: string;
  buyerPersona: string;
}


const UserPersonaGenerator = () => {
  const [business, setBusiness] = useState('');
  const [audience, setAudience] = useState('');
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState('')
  const [loaded,setLoaded] = useState(false);
  const { toast } = useToast()
  const router = useRouter();
  const [businessError, setBusinessError] = useState('');
  const [audienceError, setAudienceError] = useState('');

  const handleGenerate = async () => {
    let hasError = false;
  
    // Kiểm tra input của người dùng
    if (!business.trim()) {
      setBusinessError('Vui lòng điền ý tưởng kinh doanh của bạn.');
      hasError = true;
    } else {
      setBusinessError('');
    }
  
    if (!audience.trim()) {
      setAudienceError('Vui lòng điền thông tin khách hàng tiềm năng của bạn.');
      hasError = true;
    } else {
      setAudienceError('');
    }
  
    // Nếu có lỗi thì ngừng xử lý
    if (hasError) return;
  
    setLoading(true);
    setError(null);
    setLoaded(false); // Reset trạng thái loaded
  
    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, audience }),
      });
  
      if (!response.ok) throw new Error('Failed to generate persona');
      const data = await response.json();
  
      if (data) {
        const newId = random_id(); // Tạo ID mới
        data['id'] = newId; // Gán ID mới cho persona
        data['business'] = business;
        data['audience'] = audience;
  
        await fetch('/api/set-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        setId(newId); // Cập nhật ID mới vào trạng thái
        setPersona(data); // Cập nhật persona mới
        setLoaded(true); // Đánh dấu là đã load xong
      }
    } catch (error) {
      console.error('Error generating persona:', error);
      setError('Failed to generate persona. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    async function getDB(id: string) {
      const res = await fetch('/api/get-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "id": id }),
      })
      const newRandom_Id = random_id()
      setId(newRandom_Id)
      const obj = await res.json()
      if (obj['rowCount'] == 1) {
        const data = obj['rows'][0]
        data['nguCanhKinhDoanh'] = JSON.parse(data['nguCanhKinhDoanh'])
        setPersona(data)
        setLoaded(true)
        setId(data['id'])
      }
      else {
        router.replace('/')
      }
    }

    const params = new URLSearchParams(document.location.search);
    let id_param = params.get("id");
    if (!id_param) {
      id_param = random_id()
      setId(id_param)
    }
    else {
      getDB(id_param)
    }

  }, []);

  const copyToClipboard = (text: string) => {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers and secure contexts
        navigator.clipboard.writeText(text)
          .then(resolve)
          .catch(reject);
      } else {
        // Fallback for older browsers and mobile
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          resolve(void 0);
        } catch (err) {
          reject(err);
        } finally {
          textArea.remove();
        }
      }
    });
  };

  function random_id() {
    const array = new Uint32Array(3);
    self.crypto.getRandomValues(array);
    const random_id = (array[0] + array[1] + array[2]).toString();
    return random_id
  }

  function handleShare() {
    let location = window.location.href
    const params = new URLSearchParams(document.location.search);
    const id_param = params.get("id");
    if (!id_param) {
      location = location + "?id=" + id
    }

    copyToClipboard(location)
      .then(() => {
        toast({
          title: "Ready to share!!",
          description: "Link copied to clipboard!",
          action: <ToastAction altText="🎉">🎉</ToastAction>,
        })
      })
  }


  const SubSection = ({ title, content }: { title: string; content: string }) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-[#61BFAD] mb-2">{title}</h4>
      <div className="text-gray-300 whitespace-pre-wrap">
        {(content || '').split('\n').map((item, index) => (
          item.trim().startsWith('+') ?
            <p key={index} className="ml-4 mb-2">{item}</p> :
            <p key={index} className="mb-2">{item}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-300">
      <Head>
        <title>Xây dựng chân dung khách hàng tiềm năng B2B</title>
        <meta name="description" content="Hiểu rõ KPIS, Quy trình và Nhu cầu giải pháp của khách hàng tiềm năng để xây dựng chiến lược sản phẩm." />
      </Head>
      <h1 className="mb-2 text-center text-4xl font-bold text-[#61BFAD]">Xây dựng chân dung khách hàng tiềm năng B2B</h1>
      <p className="mb-8 text-center text-2xl leading-tight text-gray-300">
        Hiểu rõ KPIS, Quy trình và Nhu cầu giải pháp của khách hàng tiềm năng để xây dựng chiến lược sản phẩm.
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="relative flex flex-col space-y-6 items-center rounded-2xl bg-gray-800 shadow-xl md:flex-row md:space-x-8 md:space-y-0">
          {/* Generate Persona Form (Left Side) */}
          <div className="flex w-full flex-col bg-white md:w-1/2 h-min">
            <div className="flex flex-grow items-center justify-center">
              <div className="w-full max-w-4xl p-12">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-12">
                  <div className="space-y-4">
                    <label htmlFor="business" className="text-2xl font-medium text-gray-700">Mô tả ý tưởng kinh doanh của bạn</label>
                    <input
                      id="business"
                      type="text"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      className={`w-full rounded-lg border ${businessError ? 'border-red-500' : 'border-gray-300'} bg-gray-100 p-6 text-xl text-gray-800 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-[#61BFAD]`}
                      placeholder="e.g. IT support"
                    />
                    {businessError && <p className="mt-2 text-sm text-red-600">{businessError}</p>}
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="audience" className="text-2xl font-medium text-gray-700">Khách hàng tiềm năng</label>
                    <input
                      id="audience"
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className={`w-full rounded-lg border ${audienceError ? 'border-red-500' : 'border-gray-300'} bg-gray-100 p-6 text-xl text-gray-800 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-[#61BFAD]`}
                      placeholder="e.g. business owner"
                    />
                    {audienceError && <p className="mt-2 text-sm text-red-600">{audienceError}</p>}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled = {loading && !loaded}
                    className="w-full rounded-lg bg-[#61BFAD] p-6 text-2xl font-semibold text-white shadow-md transition duration-200 hover:bg-[#4FA99A]"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo chân dung khách hàng'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Image or Generated Persona (Right Side) */}
          <div className="flex h-full md:h-[70vh] w-full items-center justify-center md:w-1/2">
            <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-700 shadow-xl">
              {!persona ? (
                <div className="h-full w-full">
                  <Image
                    src={personaImage}
                    alt="User Persona Examples"
                    // style={{objectFit: "cover", position: "initial"}}
                    className="rounded-2xl object-cover h-full w-full"
                  />
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-8">
                  <div className="space-y-6">
                    <button
                      onClick={handleShare}
                      className="w-full rounded-lg bg-[#61BFAD] p-3 font-semibold text-white text-xl shadow-md transition duration-200 hover:bg-[#4FA99A]">
                      Share result
                    </button>
                    <PersonaSection
                      title="Tóm Tắt Tổng Quan"
                      icon={<User className="h-6 w-6" />}
                      content={persona.tomTatTongQuan}
                    />
                    <div className="bg-gray-800 rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="text-[#61BFAD] mr-3">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#61BFAD]">Ngữ Cảnh Kinh Doanh</h3>
                      </div>
                      <SubSection title="a. Persona Doanh Nghiệp" content={persona.nguCanhKinhDoanh.personaDoanhNghiep} />
                      <SubSection title="b. Chỉ Số Kinh Doanh" content={persona.nguCanhKinhDoanh.chiSoKinhDoanh} />
                      <SubSection title="c. Con Người và Quy Trình" content={persona.nguCanhKinhDoanh.conNguoiVaQuyTrinh} />
                      <SubSection title="d. Giải Pháp" content={persona.nguCanhKinhDoanh.giaiPhap} />
                    </div>
                    <PersonaSection
                      title="Đo Lường Thành Công"
                      icon={<BarChart className="h-6 w-6" />}
                      content={persona.doLuongThanhCong}
                    />
                    <PersonaSection
                      title="Buyer Persona"
                      icon={<PieChart className="h-6 w-6" />}
                      content={persona.buyerPersona}
                    />
                    {/* Thêm iframe vào đây */}
                    <div className="bg-white rounded-lg p-6">
                              <iframe
                                src="https://mvpbuilder.substack.com/embed"
                                width="100%"
                                height="320"
                                style={{ border: 'none', background: 'white' }}
                                frameBorder="0"
                                scrolling="no"
                              ></iframe>
                            </div>
                  </div>
                </div>            
              )}
            </div>
          </div>
        </div>
      </Suspense>

      {error && (
        <div className="mt-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

const PersonaSection = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: string }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <div className="text-[#61BFAD] mr-3">{icon}</div>
      <h3 className="text-xl font-semibold text-[#61BFAD]">{title}</h3>
    </div>
    <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
  </div>
);


export default UserPersonaGenerator;