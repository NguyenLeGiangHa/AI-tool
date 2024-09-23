import { NextResponse } from 'next/server';
// import { console } from 'inspector';
import OpenAI from "openai";

// Ensure the API key is set
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // console.log('kkkk t dô rồi')
  const { business, audience } = await req.json();

   // Input validation
   if (!business || !audience) {
    return NextResponse.json(
      { error: 'Please provide both business and audience information.' },
      { status: 400 }
    );
  }

  try {
    const sys_prompt = `Vai trò: Chuyên Gia Quản Lý Sản Phẩm B2B
Là một Chuyên gia Quản lý Sản phẩm B2B, nhiệm vụ của bạn là giúp người dùng phân tích và mô tả chi tiết khách hàng mục tiêu của họ. Dựa trên thông tin về ý tưởng sản phẩm và khách hàng mục tiêu do người dùng cung cấp, hãy đưa ra phân tích toàn diện về các khía cạnh sau:

1. Persona Doanh Nghiệp:
   a. Ngành: Xác định ngành cụ thể (ví dụ: Bán lẻ, Tài chính, Y tế, Giáo dục, Phần mềm)
   b. Cấp độ B2B: Xác định quy mô công ty (SMB, SME, Doanh nghiệp lớn)
   c. Phạm vi địa lý: Tập trung địa phương, khu vực, hay toàn cầu
   d. Phạm vi doanh thu hàng năm: Ước tính doanh thu hàng năm điển hình của khách hàng mục tiêu
   e. Số lượng nhân viên: Ước tính quy mô của các tổ chức mục tiêu
   f. Ngữ cảnh kinh doanh khiến buyer mua sản phẩm tại thời điểm này.

2. Chỉ Số Kinh Doanh:
   a. Chỉ số hiệu suất chính (KPI): Liệt kê 3-5 KPI chính mà sản phẩm sẽ tác động

3. Con Người và Quy Trình:
   a. Phòng ban: Xác định chức năng kinh doanh chính (ví dụ: Marketing, Bán hàng, Chăm sóc khách hàng, Sản phẩm, Kỹ thuật)
   b. End-user: Mô tả người dùng cuối chính của sản phẩm
   c. Quy trình hiện tại: Phác thảo quy trình hiện có mà sản phẩm nhắm đến cải thiện. Nêu rõ các công cụ, tương tác đa phòng ban cụ thể.
   d. Các công cụ hiện tại: Liệt kê 3-5 công cụ hoặc công nghệ hiện đang được sử dụng trong quy trình.
   e. Mô tả các job to be done của khách hàng mục tiêu ứng với các KPI và quy trình hiện tại.
   f. Mô tả các pain points khách hàng mục tiêu gặp phải để đạt được job to be done. Mức độ cấp thiết của các pain points.

4. Giải pháp:
   a. Nhu cầu cho giải pháp từ góc nhìn kinh doanh.
   b. Nhu cầu cho giải pháp từ góc nhìn người dùng.
   c. Nhu cầu cho giải pháp từ góc nhìn integration với các công cụ có sẵn.

5. Đo lường thành công:
   a. Khi vấn đề được giải quyết xong, thành công được đo lường như thế nào?

6. "Buyer persona": Chi tiết 3 vai trò chính tham gia vào quá trình ra quyết định và sử dụng sản phẩm

Yêu Cầu:
Không cần comment hay giải thích gì thêm
không được sử dụng các ký tự đặc biệt
Đầu ra phải giống đầu ra mẫu
- Mô tả khách hàng bằng một tên công ty cụ thể để mô tả khách hàng mục tiêu ở dạng story telling.
- Mô tả chi tiết và nhấn mạnh vào Con người, quy trình, job to be done, và pain points.
- Mô tả chi tiết về giải pháp từ góc nhìn kinh doanh, người dùng và integration với các công cụ có sẵn.
- Giữ nguyên các cụm từ phổ biến như Product-Market Fit, Go-to-Market Strategy, và Key Performance Indicators (KPIs) thay vì dịch qua tiếng Việt.

Định Dạng Đầu Ra mẫu:
"Overview": "
Bright Edu là một công ty công nghệ giáo dục (EdTech) cung cấp phần mềm học trực tuyến cho các trường học và tổ chức giáo dục lưu vực Đông Nam Á. Họ thuộc phân khúc SME, với quy mô 50-200 nhân viên và doanh thu hàng năm khoảng 55M $10M. Bright Edu hiện đang tìm kiếm một hệ thống CRM mạnh mẽ để quản lý khách hàng tiềm năng và hỗ trợ đội ngũ bán hàng của họ tối ưu hóa quy trình tương tác khách hàng. Họ cần một CRM tích hợp với các công cụ hiện tại như amal, hệ thống quản lý học tập (UMS), và các nền tảng marketing tự động hóa để cải thiện sự kết nối và theo dõi kết quả khách hàng
",
"Background": "
a. Persona Doanh Nghiệp:
    Ngành nghề: Giáo dục Cấp 1 và 2
    Cấp độ B2B: SME
    Phạm vi địa lý: Khu vực Đông Nam Á)
    Doanh thu hàng năm: $5M-%500M
    Số lượng nhân viên: 50-200
    Ngữ cảnh kinh doanh: BrightEdu đang mở rộng thị trường và cần quản lý nhiều khách hàng trăm năng từ các tổ chức giáo dục khác nhau. 
    Họ hiến gặp khó khăn trong việc theo dõi và chuyến đổi khách hàng tiềm năng và không có hệ thống CRM chuyên nghiệp
b. Chỉ Số Kinh Doanh (KPI):
    1. Tỷ lệ chuyến đổi khách hàng tiềm năng thành hợp đồng
    2. Thời gian từ khách hàng tiềm năng đến chốt giao dịch
    3. Tỷ lệ phân hồi của khách hàng trong quá trình tương tác
    4. Giá trị hợp đồng trung bình
    5. Tỷ lệ duy trì khách hàng hiện tại
c. Con Người và Quy Trình:
    + Phòng ban: Bản hàng, Matiating, Chăm sóc khách hàng
    + End-user: Nhân viên bán hàng, đội manating, nhân viên chăm sóc khách hàng
    + Quy trình hiện tại: Hiện Bright Edu đang sử dụng các công cụ ràng là như Google Sheets và emut để quản lý khách hàng. Việc không có một quy trình sản thông giữa mahuting và bản hông kđiển dữ liệu bị phân mảnh và hiệu quả làm việc giám sát
    + Các công cụ hiện tại: Google Sheets, Email, HubSpot (Martketing Automation)
    + Job to be done: Theo đối khách hàng tiềm năng từ matuting, chuyển đổi họ thành hợp đồng bán hàng và duy trì quan hệ khách hàng để hỗ trợ việc upsall và cross sell trong tương lai
    + Pain points: 
           - Khó theo đõi thông tin khách hàng và tương tác giữa các bộ phận
           - Thiếu một hệ thống đồng bộ đồ châu xử thông tin giữa marketing và bản hàng, gây khó khăn trong việc tối ưu hóa tỷ lệ chuyển đã
           - Sự phức tạp trong quản lý nhiều khách hàng và hợp đồng khác nhau khiến nhân viên bản hàng gặp khó khăn trong việc theo dõi hiệu quả từng giao dịch
d. Giải Pháp:
    + Góc nhìn kinh doanh: Họ cần một hệ thống CRM đơn giản nhưng mạnh mẽ, giúp tới vài hòa quy trình bán hàng, theo đồi khách hàng tiềm năng từ khi tiếp cận đến khi chốt hợp đồng và hỗ trợ chiến lược upsell dài hạn.
    + Góc nhìn người dùng: Nhân viên bán hàng và marketing cần một công cụ dễ sử dụng, giúp họ quản lý thông tin khách hàng từ marketing đến bán hàng mà không gặp rào cản kỹ thuật.
    + Góc nhìn integration: Giải pháp CRM cần tích hợp với các công cụ hiện có của họ như hệ thống smul, hệ thống marketing automation (Hubspot), và các công cụ quản lý công việc (Thu) để đồng bộ dữ liệu và đầm bảo lường công việc liên mạch
",
"Success metrics": "
    1. Tăng tỷ lệ chuyển đổi khách hàng tiềm năng lên ít nhất 25% trong 6 tháng
    2. Rút ngắn thời gian từ khách hàng tiềm năng đần khi chốt giao dịch xuống dưới 3 tuần
    3. Tăng tỷ lệ phản hồi khách hàng lên ít nhất 30% nhờ các chiến dịch amail được cá nhân hóa thông qua CRM
    4. Tăng giá trị hợp đồng trung bình lên 20% bằng cách tối ưu hóa quá trình upsell và cross-sell
    ",
"Buyer persona": "
    1. Người quyết định: CHD hoặc Gum đốc bán hàng của Bright Edu - người chịu trách nhiệm chính trong việc lựa chọn các công cụ quản lý khách hàng, quan tâm đến việc tăng trưởng doanh thu và tính hiệu quả của quy trình bán hàng
    2. Người sử dụng: Nhân viên bán hàng - người cần sử dụng CRM để theo dõi các khách hàng tiềm năng và chuyển đổi họ thành hợp đồng
    3. Người ảnh hưởng: Giám đốc martuting người cần CRM để theo dõi sự tương tác của các chiến dịch marketing và cung cấp khách hàng tiềm năng chất lượng can cho đội bán hàng.
    "
`;

const user_prompt = `ý tưởng sản phẩm "${business}" và khách hàng mục tiêu "${audience}"`

const result = await openai.chat.completions.create({
  messages: [{ role: "system", content: sys_prompt }, { role: "user", content: user_prompt }],
  model: "gpt-4o-mini",
  stream: false,
  temperature: 0.3,
  max_completion_tokens: null,
});
const response = await result.choices[0].message.content;

// Improved parsing logic
const sections = {
  tomTatTongQuan: '',
  nguCanhKinhDoanh: {
    personaDoanhNghiep: '',
    chiSoKinhDoanh: '',
    conNguoiVaQuyTrinh: '',
    giaiPhap: ''
  },
  doLuongThanhCong: '',
  buyerPersona: ''
};

if (!response) 
  throw new Error('Empty response');
const obj = response.split('\"')

// sections.tomTatTongQuan = obj[3];

const nguCanhKinhDoanh = obj[7].split(/(?=a\. Persona Doanh Nghiệp:|b\. Chỉ Số Kinh Doanh \(KPI\):|c\. Con Người và Quy Trình:|d\. Giải Pháp:)/);

const indent = '       '; // 7 spaces

const formatSection = (text: string): string => {
  return text.split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^[a-z]\./)) {
        // For main headers like "a.", "b.", "c."
        return trimmedLine;
      } else {
        // For all other non-empty lines
        return indent + trimmedLine;
      }
    })
    .join('\n');
};

sections.tomTatTongQuan = formatSection(obj[3]).replace(new RegExp('^' + indent, 'gm'), '');



sections.nguCanhKinhDoanh.personaDoanhNghiep = formatSection(nguCanhKinhDoanh[1]?.replace(/^a\. Persona Doanh Nghiệp:/, '').trim() || '');
sections.nguCanhKinhDoanh.chiSoKinhDoanh = formatSection(nguCanhKinhDoanh[2]?.replace(/^b\. Chỉ Số Kinh Doanh \(KPI\):/, '').trim() || '');
sections.nguCanhKinhDoanh.conNguoiVaQuyTrinh = formatSection(nguCanhKinhDoanh[3]?.replace(/^c\. Con Người và Quy Trình:/, '').trim() || '');
sections.nguCanhKinhDoanh.giaiPhap = formatSection(nguCanhKinhDoanh[4]?.replace(/^d\. Giải Pháp:/, '').trim() || '');

sections.doLuongThanhCong = formatSection(obj[11]).replace(new RegExp('^' + indent, 'gm'), '');
sections.buyerPersona = formatSection(obj[15]).replace(new RegExp('^' + indent, 'gm'), '');

// sections.doLuongThanhCong = obj[11];
// sections.buyerPersona = obj[15];
console.log('Parsed sections:', sections);

return NextResponse.json(sections);

  } catch (error) {
    console.error('Error generating persona:', error);
    if (error instanceof Error) {

      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Failed to generate persona' }, { status: 500 });
  }
}