export const Footer = () => {
    return (
        <footer className="h-[200px] bg-gray-600 flex items-center mt-auto">
            <div className="text-center text-white w-[1280px] mx-auto flex justify-between">
                <p className="text-s text-left">© 2025 커피 원두 쇼핑몰. Take Five</p>
                <p className="text-xs mt-2 text-left">
                    <span className="font-bold">팀원</span><br />
                    - 김지훈 : FE, 프로젝트 팀장<br />
                    - 이정무 : FE (개발 주도)<br />
                    - 채혜민 : BE (개발 주도), 협업 팀장<br />
                    - 석근호 : BE
                </p>
            </div>
        </footer>
    );
};
