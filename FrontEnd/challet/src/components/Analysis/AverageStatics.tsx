import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Statistic {
  category: string;
  percentage: number;
  totalMoney: number;
}

interface AverageStatisticsProps {
  myStatistics: Statistic[];
  averageStatistics: Statistic[];
  age: number;
  gender: string;
}

const AverageStatistics: React.FC<AverageStatisticsProps> = ({
  myStatistics,
  averageStatistics,
  age,
  gender,
}) => {
  // 데이터가 없는 경우 처리
  if (averageStatistics.length === 0) {
    return (
      <p className='col-span-3 text-center text-[#9095A1] mt-4'>
        전달 소비 내역이 없습니다.
      </p>
    );
  }

  // 카테고리 한글 변환
  const categoryMap: { [key: string]: string } = {
    SHOPPING: '쇼핑',
    COFFEE: '커피',
    ETC: '기타',
    TRANSPORT: '교통',
    DELIVERY: '배달',
  };

  // myStatistics가 없는 경우 기본값으로 myPercentage를 0으로 설정
  const categories = ['SHOPPING', 'COFFEE', 'ETC', 'TRANSPORT', 'DELIVERY'];

  const comparisonData = categories.map((category) => {
    const myStat = myStatistics.find((stat) => stat.category === category);
    const averageStat = averageStatistics.find(
      (avgStat) => avgStat.category === category
    );
    return {
      category: categoryMap[category] || category, // 한글 변환
      myTotalMoney: myStat ? Math.abs(myStat.totalMoney) : 0, // 음수 값을 양수로 변환
      averageTotalMoney: averageStat ? Math.abs(averageStat.totalMoney) : 0, // 음수 값을 양수로 변환
    };
  });

  return (
    <div className='max-w-[640px] mx-auto flex flex-col items-center'>
      {/* 설명 텍스트 */}
      <div className='mb-6 text-center p-4 '>
        <div className='text-xl'>
          <div className='mb-2'>
            <span>전월&nbsp;</span>
            <span className='text-[#00CCCC]'>
              {age}대 {gender}
            </span>
            <span>&nbsp;소비 패턴과 비교한 결과는?</span>
          </div>
        </div>
      </div>

      {/* 막대 차트 */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={comparisonData}>
            <XAxis dataKey='category' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='myTotalMoney' fill='#00CCCC' name='나의 소비(원)' />
            <Bar
              dataKey='averageTotalMoney'
              fill='#FF8042'
              name='평균 소비(원)'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageStatistics;
